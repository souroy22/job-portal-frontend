import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

type AcceptedFileType =
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "text"
  | "doc"
  | "xls"
  | "ppt"
  | "zip"
  | "json"
  | "csv";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  acceptedFormats: AcceptedFileType[];
  maxSizeMB?: number;
  minSizeKB?: number;
  file: File | null;
  placeHolder?: string;
}

const StyledInput = styled("input")({
  display: "none",
});

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  acceptedFormats,
  maxSizeMB = 5,
  minSizeKB = 10,
  file,
  placeHolder,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const theme = useTheme();

  const getMimeType = (fileType: AcceptedFileType): string => {
    switch (fileType) {
      case "image":
        return "image/*";
      case "pdf":
        return "application/pdf";
      case "audio":
        return "audio/*";
      case "video":
        return "video/*";
      case "text":
        return "text/plain";
      case "doc":
        return "application/msword";
      case "xls":
        return "application/vnd.ms-excel";
      case "ppt":
        return "application/vnd.ms-powerpoint";
      case "zip":
        return "application/zip";
      case "json":
        return "application/json";
      case "csv":
        return "text/csv";
      default:
        return "";
    }
  };

  const validMimeTypes = acceptedFormats.map(getMimeType);

  const isValidFile = (file: File): boolean => {
    const fileType = file.type;
    const fileSizeKB = file.size / 1024;
    const fileSizeMB = fileSizeKB / 1024;

    if (
      !validMimeTypes.some(
        (mimeType) =>
          fileType === mimeType || fileType.startsWith(mimeType.split("/")[0])
      )
    ) {
      alert("Invalid file format!");
      return false;
    }

    if (fileSizeMB > maxSizeMB) {
      alert(`File size exceeds the maximum limit of ${maxSizeMB} MB.`);
      return false;
    }

    if (fileSizeKB < minSizeKB) {
      alert(`File size is below the minimum limit of ${minSizeKB} KB.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (isValidFile(selectedFile)) {
        onFileChange(selectedFile);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        onFileChange(droppedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  return (
    <Box
      sx={{
        border: `2px dashed ${
          isDragOver ? theme.palette.primary.main : theme.palette.grey[400]
        }`,
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        position: "relative",
        transition: "border-color 0.3s",
        backgroundColor: isDragOver ? theme.palette.action.hover : "inherit",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <StyledInput
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept={validMimeTypes.join(",")}
      />
      {!file ? (
        <>
          <CloudUploadIcon
            sx={{ fontSize: 48, color: theme.palette.grey[600] }}
          />
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Drag and drop a file here, or click below to upload
          </Typography>
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              sx={{ marginTop: 2, bgcolor: "#FFF", color: "#030817" }}
            >
              {placeHolder ?? "Select File"}
            </Button>
          </label>
        </>
      ) : (
        <Box>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {file.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
          <IconButton
            color="error"
            onClick={handleRemoveFile}
            aria-label="remove file"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
