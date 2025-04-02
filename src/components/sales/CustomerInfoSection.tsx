import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerInfoSectionProps {
  formData: {
    customerName: string;
    customerSurname: string;
    customerEmail: string;
    customerPhone: string;
    bayi?: string;
    address?: string;
    province?: string;
    district?: string;
    phone2?: string;
    fax?: string;
    paymentType?: string;
    amount?: string;
    notes?: string;
    advanceAmount?: string;
    installmentAmount?: string;
    advanceDate?: string;
    installmentDate?: string;
    position?: string;
    correspondenceAddress?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (name: string, value: string) => void;
}

export function CustomerInfoSection({ formData, onChange, onSelectChange }: CustomerInfoSectionProps) {
  const handleSelectChange = (name: string, value: string) => {
    if (onSelectChange) {
      onSelectChange(name, value);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Information</h3>
      
      {/* Bayi (Dealer) */}
      <div className="space-y-2">
        <Label htmlFor="bayi">Bayi</Label>
        <Input
          id="bayi"
          name="bayi"
          value={formData.bayi || ""}
          onChange={onChange}
          placeholder="Dealer name"
        />
      </div>
      
      {/* Name and Surname */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Ad (First Name)</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={onChange}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerSurname">Soyad (Last Name)</Label>
          <Input
            id="customerSurname"
            name="customerSurname"
            value={formData.customerSurname}
            onChange={onChange}
            placeholder="Doe"
          />
        </div>
      </div>
      
      {/* Email and Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={onChange}
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">GSM No (Mobile Phone)</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={onChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Adres (Address)</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={onChange}
          placeholder="Customer address"
          rows={3}
        />
      </div>
      
      {/* Province and District */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province">İl (Province)</Label>
          <Input
            id="province"
            name="province"
            value={formData.province || ""}
            onChange={onChange}
            placeholder="Province"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">İlçe (District)</Label>
          <Input
            id="district"
            name="district"
            value={formData.district || ""}
            onChange={onChange}
            placeholder="District"
          />
        </div>
      </div>
      
      {/* Additional Phone Numbers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone1">Tel-1 (Phone 1)</Label>
          <Input
            id="phone1"
            name="phone1"
            value={formData.customerPhone}
            onChange={onChange}
            placeholder="Phone number"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone2">Tel-2 (Phone 2)</Label>
          <Input
            id="phone2"
            name="phone2"
            value={formData.phone2 || ""}
            onChange={onChange}
            placeholder="Additional phone number"
          />
        </div>
      </div>
      
      {/* Fax */}
      <div className="space-y-2">
        <Label htmlFor="fax">Fax</Label>
        <Input
          id="fax"
          name="fax"
          value={formData.fax || ""}
          onChange={onChange}
          placeholder="Fax number"
        />
      </div>
      
      {/* Payment Type */}
      {onSelectChange && (
        <div className="space-y-2">
          <Label htmlFor="paymentType">Ödeme Tipi (Payment Type)</Label>
          <Select 
            value={formData.paymentType || "deposit"} 
            onValueChange={(value) => handleSelectChange("paymentType", value)}
          >
            <SelectTrigger id="paymentType">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="installment">Taksit (Installment)</SelectItem>
              <SelectItem value="cash">Nakit (Cash)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Alınan Tutar (Amount)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount || ""}
          onChange={onChange}
          placeholder="0.00"
        />
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Not (Notes)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={onChange}
          placeholder="Additional notes"
          rows={3}
        />
      </div>
      
      {/* Advance Amount and Installment Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="advanceAmount">Peşinat Tutarı (Advance Amount)</Label>
          <Input
            id="advanceAmount"
            name="advanceAmount"
            type="number"
            value={formData.advanceAmount || ""}
            onChange={onChange}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="installmentAmount">Taksit Tutarı (Installment Amount)</Label>
          <Input
            id="installmentAmount"
            name="installmentAmount"
            type="number"
            value={formData.installmentAmount || ""}
            onChange={onChange}
            placeholder="0.00"
          />
        </div>
      </div>
      
      {/* Advance Date and Installment Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="advanceDate">Peşinat Alınma Tarihi (Advance Date)</Label>
          <Input
            id="advanceDate"
            name="advanceDate"
            type="date"
            value={formData.advanceDate || ""}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="installmentDate">Taksit Alınma Tarihi (Installment Date)</Label>
          <Input
            id="installmentDate"
            name="installmentDate"
            type="date"
            value={formData.installmentDate || ""}
            onChange={onChange}
          />
        </div>
      </div>
      
      {/* Position */}
      {onSelectChange && (
        <div className="space-y-2">
          <Label htmlFor="position">Pozisyon (Position)</Label>
          <Select 
            value={formData.position || "0"} 
            onValueChange={(value) => handleSelectChange("position", value)}
          >
            <SelectTrigger id="position">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0.Satış</SelectItem>
              <SelectItem value="1">1.Satış</SelectItem>
              <SelectItem value="2">2.Satış</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Correspondence Address */}
      <div className="space-y-2">
        <Label htmlFor="correspondenceAddress">Yazışma Adresi (Correspondence Address)</Label>
        <Textarea
          id="correspondenceAddress"
          name="correspondenceAddress"
          value={formData.correspondenceAddress || ""}
          onChange={onChange}
          placeholder="Correspondence address"
          rows={3}
        />
      </div>
    </div>
  );
}
