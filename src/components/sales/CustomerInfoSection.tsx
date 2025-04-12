import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    paymentMethods?: string; // JSON string containing payment methods array
  };
  formErrors?: {
    customerName?: string;
    customerSurname?: string;
    customerEmail?: string;
    customerPhone?: string;
    bayi?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (name: string, value: string) => void;
  isViewMode?: boolean;
}

export function CustomerInfoSection({ formData, formErrors = {}, onChange, onSelectChange, isViewMode = false }: CustomerInfoSectionProps) {
  const [useBayi, setUseBayi] = useState<boolean>(!!formData.bayi);
  
  // Toggle between Bayi and Ad Soyad
  const toggleUseBayi = (value: boolean) => {
    setUseBayi(value);
    
    // Clear the appropriate fields
    if (value) {
      // Using Bayi, clear Ad Soyad
      const event = {
        target: {
          name: 'customerName',
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
      
      const event2 = {
        target: {
          name: 'customerSurname',
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event2);
    } else {
      // Using Ad Soyad, clear Bayi
      const event = {
        target: {
          name: 'bayi',
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (onSelectChange) {
      onSelectChange(name, value);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Müşteri Bilgileri</h3>
      
      {/* Customer Type Selection */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="customerType-individual"
            name="customerType"
            checked={!useBayi}
            onChange={() => toggleUseBayi(false)}
            className="mr-2"
            disabled={isViewMode}
          />
          <Label htmlFor="customerType-individual">Bireysel Müşteri</Label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="customerType-dealer"
            name="customerType"
            checked={useBayi}
            onChange={() => toggleUseBayi(true)}
            className="mr-2"
            disabled={isViewMode}
          />
          <Label htmlFor="customerType-dealer">Şirket/Kuruluş</Label>
        </div>
      </div>
      
      {/* Bayi (Dealer) */}
      {useBayi && (
        <div className="space-y-2">
          <Label htmlFor="bayi">Şirket/Kuruluş Adı</Label>
          <Input
            id="bayi"
            name="bayi"
            value={formData.bayi || ""}
            onChange={onChange}
            placeholder="Bayi adı"
            className={formErrors.bayi ? "border-red-500" : ""}
            readOnly={isViewMode}
          />
          {formErrors.bayi && (
            <Alert variant="destructive" className="py-2 mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formErrors.bayi}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {/* Name and Surname */}
      {!useBayi && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Ad</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={onChange}
              placeholder="Ahmet"
              className={formErrors.customerName ? "border-red-500" : ""}
            />
            {formErrors.customerName && (
              <Alert variant="destructive" className="py-2 mt-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formErrors.customerName}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerSurname">Soyad</Label>
            <Input
              id="customerSurname"
              name="customerSurname"
              value={formData.customerSurname}
              onChange={onChange}
              placeholder="Yerdelen"
              className={formErrors.customerSurname ? "border-red-500" : ""}
            />
            {formErrors.customerSurname && (
              <Alert variant="destructive" className="py-2 mt-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formErrors.customerSurname}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
      
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
            placeholder="yerdelen@example.com"
            className={formErrors.customerEmail ? "border-red-500" : ""}
          />
          {formErrors.customerEmail && (
            <Alert variant="destructive" className="py-2 mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formErrors.customerEmail}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">GSM No</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={onChange}
            placeholder="+90 (555) 123-4567"
            className={formErrors.customerPhone ? "border-red-500" : ""}
          />
          {formErrors.customerPhone && (
            <Alert variant="destructive" className="py-2 mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formErrors.customerPhone}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      
      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Adres  </Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={onChange}
          placeholder="Adres"
          rows={3}
        />
      </div>
      
      {/* Province and District */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province">İl  </Label>
          <Input
            id="province"
            name="province"
            value={formData.province || ""}
            onChange={onChange}
            placeholder="İl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">İlçe</Label>
          <Input
            id="district"
            name="district"
            value={formData.district || ""}
            onChange={onChange}
            placeholder="İlçe"
          />
        </div>
      </div>
      
      {/* Additional Phone Numbers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone1">Tel-1</Label>
          <Input
            id="phone1"
            name="phone1"
            value={formData.customerPhone}
            onChange={onChange}
            placeholder="GSM No"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone2">Tel-2</Label>
          <Input
            id="phone2"
            name="phone2"
            value={formData.phone2 || ""}
            onChange={onChange}
            placeholder="Telefon"
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
          placeholder="Fax"
        />
      </div>
      
      
      
      {/* Ödeme Bilgileri Section */}
      <h3 className="text-lg font-semibold mt-8">Ödeme Bilgileri</h3>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Ödeme Yöntemleri</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Add a new payment method entry
              const newPaymentMethod = {
                type: 'cash',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                installmentCount: '1'
              };
              
              // Get current payment methods or initialize empty array
              const currentPaymentMethods = formData.paymentMethods ? JSON.parse(formData.paymentMethods) : [];
              
              // Create a synthetic event to update the form data
              const event = {
                target: {
                  name: 'paymentMethods',
                  value: JSON.stringify([...currentPaymentMethods, newPaymentMethod])
                }
              } as React.ChangeEvent<HTMLInputElement>;
              
              onChange(event);
            }}
            className="px-2"
          >
            <span className="mr-1">+</span> Ödeme Ekle
          </Button>
        </div>
        
        {/* Payment Method Items */}
        {(formData.paymentMethods ? JSON.parse(formData.paymentMethods as string) : []).length > 0 ? (
          (formData.paymentMethods ? JSON.parse(formData.paymentMethods as string) : []).map((payment: any, index: number) => (
            <div key={index} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {payment.type === 'cash' ? 'Peşinat Ödeme' : 
                   payment.type === 'installment' ? 'Taksit Ödeme' : 
                   payment.type === 'bank_transfer' ? 'Havale Ödeme' : 
                   `Ödeme #${index + 1}`}
                </h4>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    // Remove this payment method
                    const currentPaymentMethods = JSON.parse(formData.paymentMethods as string);
                    const updatedPaymentMethods = currentPaymentMethods.filter((_: any, i: number) => i !== index);
                    
                    // Create a synthetic event to update the form data
                    const event = {
                      target: {
                        name: 'paymentMethods',
                        value: JSON.stringify(updatedPaymentMethods)
                      }
                    } as React.ChangeEvent<HTMLInputElement>;
                    
                    onChange(event);
                  }}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Ödeme Tipi</Label>
                  <Select
                    value={payment.type}
                    onValueChange={(value) => {
                      // Update this payment method's type
                      const currentPaymentMethods = JSON.parse(formData.paymentMethods as string);
                      currentPaymentMethods[index].type = value;
                      
                      // Create a synthetic event to update the form data
                      const event = {
                        target: {
                          name: 'paymentMethods',
                          value: JSON.stringify(currentPaymentMethods)
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      
                      onChange(event);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ödeme tipi seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Peşinat</SelectItem>
                      <SelectItem value="bank_transfer">Havale</SelectItem>
                      <SelectItem value="installment">Taksit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>
                    {payment.type === 'cash' ? 'Peşinat Tutarı' : 
                     payment.type === 'installment' ? 'Taksit Tutarı' : 
                     payment.type === 'bank_transfer' ? 'Havale Tutarı' : 
                     'Tutar'}
                  </Label>
                  <Input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => {
                      // Update this payment method's amount
                      const currentPaymentMethods = JSON.parse(formData.paymentMethods as string);
                      currentPaymentMethods[index].amount = e.target.value;
                      
                      // Create a synthetic event to update the form data
                      const event = {
                        target: {
                          name: 'paymentMethods',
                          value: JSON.stringify(currentPaymentMethods)
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      
                      onChange(event);
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {payment.type === 'cash' ? 'Peşinat Ödeme Tarihi' : 
                   payment.type === 'installment' ? 'Taksit Ödeme Tarihi' : 
                   payment.type === 'bank_transfer' ? 'Havale Ödeme Tarihi' : 
                   'Ödeme Tarihi'}
                </Label>
                <Input
                  type="date"
                  value={payment.date}
                  onChange={(e) => {
                    // Update this payment method's date
                    const currentPaymentMethods = JSON.parse(formData.paymentMethods as string);
                    currentPaymentMethods[index].date = e.target.value;
                    
                    // Create a synthetic event to update the form data
                    const event = {
                      target: {
                        name: 'paymentMethods',
                        value: JSON.stringify(currentPaymentMethods)
                      }
                    } as React.ChangeEvent<HTMLInputElement>;
                    
                    onChange(event);
                  }}
                />
              </div>
              
              {/* Show installment count field for installment or bank transfer */}
              {(payment.type === 'installment' || payment.type === 'bank_transfer') && (
                <div className="space-y-2 mt-3">
                  <Label>Taksit Sayısı</Label>
                  <Input
                    type="number"
                    min="1"
                    value={payment.installmentCount || '1'}
                    onChange={(e) => {
                      // Update this payment method's installment count
                      const currentPaymentMethods = JSON.parse(formData.paymentMethods as string);
                      currentPaymentMethods[index].installmentCount = e.target.value;
                      
                      // Create a synthetic event to update the form data
                      const event = {
                        target: {
                          name: 'paymentMethods',
                          value: JSON.stringify(currentPaymentMethods)
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      
                      onChange(event);
                    }}
                    placeholder="1"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
            Henüz ödeme yöntemi eklenmedi. Eklemek için "Ödeme Ekle" butonuna tıklayın.
          </div>
        )}
        
        {/* Total Amount Display */}
        {formData.paymentMethods && JSON.parse(formData.paymentMethods as string).length > 0 && (
          <div className="flex justify-between items-center font-medium p-2 border-t mt-2 pt-2">
            <span>Toplam Ödeme:</span>
            <span>
              {JSON.parse(formData.paymentMethods as string)
                .reduce((total: number, payment: any) => total + (parseFloat(payment.amount) || 0), 0)
                .toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </span>
          </div>
        )}
      </div>
      
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Deposite</Label>
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
        <Label htmlFor="notes">Not</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={onChange}
          placeholder="Additional notes"
          rows={3}
        />
      </div>
      
      {/* Position */}
      {onSelectChange && (
        <div className="space-y-2">
          <Label htmlFor="position">Pozisyon</Label>
          <Select 
            value={formData.position || "0"} 
            onValueChange={(value) => handleSelectChange("position", value)}
            disabled={isViewMode}
          >
            <SelectTrigger id="position">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1. Kesin</SelectItem>
              <SelectItem value="2">2. Opsiyonlu Satış</SelectItem>
              <SelectItem value="3">3. İptal</SelectItem>
              <SelectItem value="4">4. Davalık Müşteriler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Correspondence Address */}
      <div className="space-y-2">
        <Label htmlFor="correspondenceAddress">Yazışma Adresi</Label>
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
