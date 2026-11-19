package com.spree.service;

import com.spree.exception.BadRequestException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB limit
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".doc", ".docx");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final Path rootLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation.resolve("materials"));
            Files.createDirectories(rootLocation.resolve("submissions"));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File size exceeds 1 MB limit. Your file: " + (file.getSize() / 1024) + " KB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new BadRequestException("Invalid filename or missing extension");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file type. Only PDF (.pdf) and Word (.doc, .docx) documents are allowed.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            // Some browsers send octet-stream for docx, but if mime is known and not allowed, reject
            if (!contentType.equalsIgnoreCase("application/octet-stream")) {
                throw new BadRequestException("Unsupported MIME type: " + contentType + ". Allowed: PDF, DOC, DOCX");
            }
        }
    }

    public String storeFile(MultipartFile file, String subDirectory) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        String storedFilename = UUID.randomUUID().toString() + extension;

        try {
            Path targetDir = rootLocation.resolve(subDirectory).normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            Path targetPath = targetDir.resolve(storedFilename).normalize();

            // Guard against path traversal
            if (!targetPath.startsWith(rootLocation)) {
                throw new BadRequestException("Cannot store file outside target directory");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            return subDirectory + "/" + storedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalFilename, e);
        }
    }

    public Resource loadFileAsResource(String relativePath) {
        try {
            Path filePath = rootLocation.resolve(relativePath).normalize();
            if (!filePath.startsWith(rootLocation)) {
                throw new BadRequestException("Cannot access file outside storage directory");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new BadRequestException("File not found or not readable: " + relativePath);
            }
        } catch (MalformedURLException e) {
            throw new BadRequestException("Malformed file path: " + relativePath);
        }
    }

    public void deleteFile(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) return;
        try {
            Path filePath = rootLocation.resolve(relativePath).normalize();
            if (filePath.startsWith(rootLocation)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException ignored) {
        }
    }
}
