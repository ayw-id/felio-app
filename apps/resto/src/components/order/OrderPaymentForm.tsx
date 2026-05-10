import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ImageType, getBase64FromFile } from "@/pages/Menu";
import { Installment } from "@/pages/Orders";
import { getAmount } from "@/lib/utils";

interface OrderPaymentFormProps {
  onPayment: () => void;
  selectedInstallment: Installment;
}

const OrderPaymentForm: React.FC<OrderPaymentFormProps> = ({
  onPayment,
  selectedInstallment,
}) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    receiptImage: null as ImageType | null,
  });

  const handleReceiptSelected = async (files: ImageType[]) => {
    if (!files) return;
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    const file = fileArray[0];

    const receiptImage = {
      file,
      preview: URL.createObjectURL(file),
      src: "",
      base64: await getBase64FromFile(file),
      size: file.size,
      type: file.type?.replace("image/", ""),
    };

    setForm({ ...form, receiptImage });
  };

  const handlePayment = () => {
    const newReceipt = {
      ...form.receiptImage,
    };

    delete newReceipt.file;
    delete newReceipt.preview;
    onPayment({
      receipt: form.receiptImage,
      idInstallment: selectedInstallment.id,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Proses Pembayaran</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            {selectedInstallment && (
              <p className="text-right">
                (Jatuh tempo: {selectedInstallment.dueDate}){" "}
                <b>Rp.{getAmount(selectedInstallment.amount)}</b>
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="receiptImage">Gambar Bukti Transfer</Label>
            <Input
              id="receiptImage"
              type="file"
              className="mt-4"
              accept="image/*"
              onChange={(e) => handleReceiptSelected(e.target.files)}
            />
            {form.receiptImage?.preview && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  Image Preview:
                </p>
                <img
                  src={form.receiptImage?.preview}
                  alt="Receipt Preview"
                  className="max-w-full max-h-64 rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedInstallment || !form.receiptImage}
              onClick={() => handlePayment()}
            >
              Lanjutkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPaymentForm;
