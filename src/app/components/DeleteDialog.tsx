"use client";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemDescription?: string;
}

export default function DeleteDialog({ open, onClose, onConfirm, itemDescription }: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "error.main", color: "white", display: "flex", alignItems: "center" }}>
        <WarningIcon sx={{ mr: 1 }} />
        Confirm Delete
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1">
          Are you sure you want to delete this entry?
        </Typography>
        {itemDescription && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            "{itemDescription}"
          </Typography>
        )}
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 