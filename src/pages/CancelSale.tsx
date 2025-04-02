import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SaleRecordWithDetails } from "@/types";
import { toast } from "sonner";
import { XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Import mock data from SalesRecords
// In a real app, this would be replaced with API calls
import { MOCK_SALES_RECORDS } from "./SalesRecords";

export default function CancelSale() {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<SaleRecordWithDetails | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Find the sale by ID
    const foundSale = MOCK_SALES_RECORDS.find(record => record.id === saleId);
    if (foundSale) {
      setSale(foundSale);
    } else {
      toast.error("Satış kaydı bulunamadı");
      navigate("/sales-records");
    }
  }, [saleId, navigate]);

  const handleCancelSale = () => {
    if (!sale) return;
    if (!cancellationReason.trim()) {
      toast.error("İptal sebebi girilmelidir");
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would be an API call
    // For now, we'll update the mock data directly
    setTimeout(() => {
      const updatedRecords = MOCK_SALES_RECORDS.map(record => {
        if (record.id === sale.id) {
          return {
            ...record,
            isCanceled: true,
            cancellationReason: cancellationReason.trim(),
            cancellationDate: new Date().toISOString(),
            paymentStatus: 'failed' as const
          };
        }
        return record;
      });

      // Update the mock data
      // In a real app, this would be handled by the API
      Object.assign(MOCK_SALES_RECORDS, updatedRecords);

      setIsSubmitting(false);
      toast.success("Satış başarıyla iptal edildi");
      navigate("/sales-records");
    }, 1000); // Simulate API delay
  };

  if (!sale) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check if the sale is already canceled or not pending
  if (sale.isCanceled) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bu satış zaten iptal edilmiş</h2>
            <p className="mb-4 text-muted-foreground">
              İptal sebebi: {sale.cancellationReason}
            </p>
            <Button onClick={() => navigate("/sales-records")}>
              Satış Kayıtlarına Dön
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (sale.paymentStatus !== 'pending') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <XCircle className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bu satış iptal edilemez</h2>
            <p className="mb-4 text-muted-foreground">
              Yalnızca ödeme durumu "Beklemede" olan satışlar iptal edilebilir.
            </p>
            <Button onClick={() => navigate("/sales-records")}>
              Satış Kayıtlarına Dön
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            className="mr-4" 
            onClick={() => navigate("/sales-records")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
          <h1 className="text-2xl font-bold">Satış İptal</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sale Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Satış Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Genel Bilgiler</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Satış Tarihi:</span>
                        <span>{format(new Date(sale.startDate), "dd.MM.yyyy")}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Satış No:</span>
                        <span>{sale.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Tutar:</span>
                        <span className="font-medium">{sale.amount.toLocaleString()} ₺</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Ödeme Durumu:</span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          sale.paymentStatus === "completed" ? "bg-green-100 text-green-800" : 
                          sale.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        )}>
                          {sale.paymentStatus === "completed" ? "Tamamlandı" :
                           sale.paymentStatus === "pending" ? "Beklemede" : "Başarısız"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Ödeme Tipi:</span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          sale.paymentMethod === "credit_card" ? "bg-blue-100 text-blue-800" :
                          sale.paymentMethod === "bank_transfer" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {sale.paymentMethod === "credit_card" ? "Kredi Kartı" :
                           sale.paymentMethod === "bank_transfer" ? "Havale" : "Nakit"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Müşteri ve Proje Bilgileri</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Müşteri:</span>
                        <span>{sale.customer?.name} {sale.customer?.surname}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Telefon:</span>
                        <span>{sale.customer?.phone}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{sale.customer?.email}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Proje:</span>
                        <span>{sale.project?.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Daire No:</span>
                        <span>{sale.room?.roomNumber}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Kat:</span>
                        <span>{sale.room?.floor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cancellation Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>İptal İşlemi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cancellationReason">İptal Sebebi</Label>
                    <Textarea
                      id="cancellationReason"
                      placeholder="İptal sebebini detaylı olarak giriniz"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleCancelSale}
                    disabled={isSubmitting || !cancellationReason.trim()}
                  >
                    {isSubmitting ? "İşleniyor..." : "Satışı İptal Et"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    <strong>Not:</strong> İptal işlemi geri alınamaz. İptal sebebi kayıtlarda tutulacaktır.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
