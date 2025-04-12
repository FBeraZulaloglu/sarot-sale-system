import { useState, useEffect } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Project, Room, SaleRecordWithDetails } from "@/types";
import { PropertyDetailsSection } from "./PropertyDetailsSection";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { MOCK_ROOMS } from "@/data/projects";
import { createSaleRecord, MOCK_CUSTOMERS } from "@/data/sales";

interface SaleFormContainerProps {
  selectedRoom: Room | null;
  selectedProject: Project | null;
  existingSale?: SaleRecordWithDetails | null;
  isViewMode?: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
  onSuccess: (projectId: string) => void;
}

export function SaleFormContainer({ 
  selectedRoom, 
  selectedProject,
  existingSale = null,
  isViewMode = false,
  isEditMode = false,
  onCancel,
  onSuccess
}: SaleFormContainerProps) {
  // Form state
  const [formData, setFormData] = useState({
    projectId: selectedProject?.id || existingSale?.projectId || "",
    roomId: selectedRoom?.id || existingSale?.roomId || "",
    customerName: existingSale?.customer?.name || "",
    customerSurname: existingSale?.customer?.surname || "",
    customerEmail: existingSale?.customer?.email || "",
    customerPhone: existingSale?.customer?.phone || "",
    startDate: existingSale?.startDate ? new Date(existingSale.startDate) : new Date(),
    paymentMethod: (existingSale?.paymentMethod || "credit_card") as "credit_card" | "bank_transfer" | "cash",
    includesTax: true,
    salespersonId: existingSale?.salespersonId || "",
    paymentMethods: JSON.stringify([
      {
        type: 'cash',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      }
    ]),
    // New customer fields
    bayi: "",
    address: "",
    province: "",
    district: "",
    phone2: "",
    fax: "",
    paymentType: "deposit",
    amount: existingSale?.amount ? existingSale.amount.toString() : "",
    notes: "",
    advanceAmount: "",
    installmentAmount: "",
    advanceDate: "",
    installmentDate: "",
    position: "1",
    correspondenceAddress: ""
  });
  
  // State to track form errors
  const [formErrors, setFormErrors] = useState<{
    projectId?: string;
    roomId?: string;
    customerName?: string;
    customerSurname?: string;
    customerEmail?: string;
    customerPhone?: string;
    bayi?: string;
  }>({});
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, startDate: date }));
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, includesTax: checked }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormErrors({});
    
    // Create new errors object
    const newErrors: typeof formErrors = {};
    
    // Project and room validation
    if (!formData.projectId) {
      newErrors.projectId = 'Proje seçilmedi';
    }
    
    if (!formData.roomId) {
      newErrors.roomId = 'Oda seçilmedi';
    }
    
    // Customer information validation
    const hasBayi = !!formData.bayi && formData.bayi.trim() !== '';
    const hasCustomerName = !!formData.customerName && formData.customerName.trim() !== '';
    const hasCustomerSurname = !!formData.customerSurname && formData.customerSurname.trim() !== '';
    
    // Either Bayi OR (First Name AND Last Name) must be provided
    if (hasBayi) {
      // If using Bayi, check if it's filled
      if (!formData.bayi || formData.bayi.trim() === '') {
        newErrors.bayi = 'Bayi adı boş bırakılamaz';
      }
    } else {
      // If using Ad-Soyad, check if both are filled
      if (!hasCustomerName) {
        newErrors.customerName = 'Ad alanı boş bırakılamaz';
      }
      
      if (!hasCustomerSurname) {
        newErrors.customerSurname = 'Soyad alanı boş bırakılamaz';
      }
    }
    
    // Email and phone are always required
    if (!formData.customerEmail || formData.customerEmail.trim() === '') {
      newErrors.customerEmail = 'Email alanı boş bırakılamaz';
    }
    
    if (!formData.customerPhone || formData.customerPhone.trim() === '') {
      newErrors.customerPhone = 'GSM No alanı boş bırakılamaz';
    }
    
    // If there are validation errors, set them and stop form submission
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      alert('Satış kaydı oluşturulamadı! Lütfen gerekli alanları doldurunuz.');
      return;
    }
    
    // Check if customer already exists or create a new one
    let customerId = "";
    
    // We already have hasBayi defined above, reuse it here
    
    if (hasBayi) {
      // For Bayi, check if there's an existing customer with this Bayi name and email
      const existingBayi = MOCK_CUSTOMERS.find(
        c => c.email.toLowerCase() === formData.customerEmail.toLowerCase() && 
             c.name === formData.bayi
      );
      
      if (existingBayi) {
        customerId = existingBayi.id;
      } else {
        // Create a new Bayi customer
        customerId = `c${MOCK_CUSTOMERS.length + 1}`;
        // In a real app, you would add the new customer to the database here
      }
    } else {
      // For individual customers, check by name, surname, and email
      const existingCustomer = MOCK_CUSTOMERS.find(
        c => c.email.toLowerCase() === formData.customerEmail.toLowerCase() &&
             c.name === formData.customerName &&
             c.surname === formData.customerSurname
      );
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create a new individual customer
        customerId = `c${MOCK_CUSTOMERS.length + 1}`;
        // In a real app, you would add the new customer to the database here
      }
    }
    
    // Calculate end date (for example, 14 days after start date)
    const endDate = new Date(formData.startDate);
    endDate.setDate(endDate.getDate() + 14); // 2 weeks reservation by default
    
    // Calculate amount and tax
    const selectedRoomPrice = selectedRoomDetails?.price || 0;
    const taxRate = 0.18; // 18% tax rate
    const tax = formData.includesTax ? Math.round(selectedRoomPrice * taxRate) : 0;
    
    // Calculate total amount from payment methods
    let amount = 0;
    if (formData.paymentMethods) {
      try {
        const paymentMethods = JSON.parse(formData.paymentMethods);
        amount = paymentMethods.reduce((total: number, payment: any) => {
          return total + (parseFloat(payment.amount) || 0);
        }, 0);
      } catch (error) {
        console.error('Error parsing payment methods:', error);
      }
    }
    
    // If no payment methods with amounts, fall back to the amount field or room price
    if (amount === 0) {
      amount = parseInt(formData.amount) || selectedRoomPrice;
    }
    
    // Process payment methods from form data
    let paymentMethods = undefined;
    if (formData.paymentMethods) {
      try {
        const parsedPaymentMethods = JSON.parse(formData.paymentMethods);
        // Filter out payment methods with empty amounts
        paymentMethods = parsedPaymentMethods
          .filter((payment: any) => payment.amount && parseFloat(payment.amount) > 0)
          .map((payment: any) => ({
            type: payment.type,
            amount: parseFloat(payment.amount),
            date: payment.date
          }));
      } catch (error) {
        console.error('Error parsing payment methods:', error);
      }
    }
    
    // Create the sale record
    const newSale = createSaleRecord({
      projectId: formData.projectId,
      roomId: formData.roomId,
      salespersonId: formData.salespersonId || "s1", // Use selected salesperson or default
      customerId: customerId,
      startDate: formData.startDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: amount,
      paymentStatus: "pending",
      paymentMethod: formData.paymentMethod, // Keep for backward compatibility
      paymentMethods: paymentMethods, // Add the new payment methods array
      tax: tax,
      isConfirmed: true
    });
    
    console.log("Created new sale record:", newSale);
    onSuccess(formData.projectId);
  };
  
  // List of available rooms (excluding sold rooms)
  const availableRooms = MOCK_ROOMS.filter(room => 
    room.status === 'available' && 
    (formData.projectId ? room.projectId === formData.projectId : true)
  );
  
  // Get room details
  const selectedRoomDetails = formData.roomId 
    ? MOCK_ROOMS.find(room => room.id === formData.roomId) 
    : null;

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <PropertyDetailsSection 
          formData={formData}
          formErrors={formErrors}
          selectedRoomDetails={selectedRoomDetails}
          availableRooms={availableRooms}
          onSelectChange={handleSelectChange}
          onDateChange={handleDateChange}
          onCheckboxChange={handleCheckboxChange}
          selectedProject={selectedProject}
          selectedRoom={selectedRoom}
          isViewMode={isViewMode}
        />
        
        <Separator />
        
        <CustomerInfoSection 
          formData={formData}
          formErrors={formErrors}
          onChange={handleInputChange}
          onSelectChange={handleSelectChange}
          isViewMode={isViewMode}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={onCancel}>
          {isViewMode ? 'Geri' : 'İptal'}
        </Button>
        {!isViewMode && (
          <Button type="submit" disabled={isViewMode}>
            {isEditMode ? 'Güncelle' : 'Satış Kaydı Oluştur'}
          </Button>
        )}
      </CardFooter>
    </form>
  );
}
