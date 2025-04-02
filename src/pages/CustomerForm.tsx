import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

export default function CustomerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bayi: "",
    name: "",
    surname: "",
    email: "",
    address: "",
    province: "", // il
    district: "", // ilçe
    mobilePhone: "", // GSM no
    saleDate: format(new Date(), "yyyy-MM-dd"),
    phone1: "",
    phone2: "",
    fax: "",
    paymentType: "deposit", // ödeme tipi (Deposit, taksit, nakit)
    amount: "", // alınan tutar
    notes: "", // not
    advanceAmount: "", // peşinat tutarı
    installmentAmount: "", // taksit tutarı
    advanceDate: format(new Date(), "yyyy-MM-dd"), // peşinat alınma tarihi
    installmentDate: format(new Date(), "yyyy-MM-dd"), // taksit alınma tarihi
    position: "0", // pozisyon (0.satış)
    correspondenceAddress: "" // yazışma adresi
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the customer data
    console.log("Customer data:", formData);
    // Navigate back to customers list
    navigate("/customers");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 flex items-center gap-1"
          onClick={() => navigate("/customers")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bayi */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bayi">Bayi</Label>
                  <Input
                    id="bayi"
                    value={formData.bayi}
                    onChange={(e) => handleChange("bayi", e.target.value)}
                  />
                </div>
              </div>

              {/* Name and Surname */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => handleChange("surname", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Province and District */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">İl</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">İlçe</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Phone and Sale Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">GSM No</Label>
                  <Input
                    id="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={(e) => handleChange("mobilePhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleDate">Satış Tarihi</Label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => handleChange("saleDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Phone 1 and Phone 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone1">Tel-1</Label>
                  <Input
                    id="phone1"
                    value={formData.phone1}
                    onChange={(e) => handleChange("phone1", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone2">Tel-2</Label>
                  <Input
                    id="phone2"
                    value={formData.phone2}
                    onChange={(e) => handleChange("phone2", e.target.value)}
                  />
                </div>
              </div>

              {/* Fax */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fax">Fax</Label>
                  <Input
                    id="fax"
                    value={formData.fax}
                    onChange={(e) => handleChange("fax", e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Type */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Ödeme Tipi</Label>
                  <Select 
                    value={formData.paymentType} 
                    onValueChange={(value) => handleChange("paymentType", value)}
                  >
                    <SelectTrigger id="paymentType">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="installment">Taksit</SelectItem>
                      <SelectItem value="cash">Nakit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amount */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Alınan Tutar</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Not</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Advance Amount and Installment Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advanceAmount">Peşinat Tutarı</Label>
                  <Input
                    id="advanceAmount"
                    type="number"
                    value={formData.advanceAmount}
                    onChange={(e) => handleChange("advanceAmount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installmentAmount">Taksit Tutarı</Label>
                  <Input
                    id="installmentAmount"
                    type="number"
                    value={formData.installmentAmount}
                    onChange={(e) => handleChange("installmentAmount", e.target.value)}
                  />
                </div>
              </div>

              {/* Advance Date and Installment Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advanceDate">Peşinat Alınma Tarihi</Label>
                  <Input
                    id="advanceDate"
                    type="date"
                    value={formData.advanceDate}
                    onChange={(e) => handleChange("advanceDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installmentDate">Taksit Alınma Tarihi</Label>
                  <Input
                    id="installmentDate"
                    type="date"
                    value={formData.installmentDate}
                    onChange={(e) => handleChange("installmentDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Position */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Pozisyon</Label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(value) => handleChange("position", value)}
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
              </div>

              {/* Correspondence Address */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correspondenceAddress">Yazışma Adresi</Label>
                  <Textarea
                    id="correspondenceAddress"
                    value={formData.correspondenceAddress}
                    onChange={(e) => handleChange("correspondenceAddress", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/customers")}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Customer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
