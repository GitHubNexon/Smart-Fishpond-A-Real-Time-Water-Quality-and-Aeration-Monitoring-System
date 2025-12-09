import React, { useState } from 'react';
import FormTable from '@/components/customs/form-table/form-table';
import { Column } from '@/components/customs/form-table/form-table.interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Plus } from 'lucide-react';

interface InventoryItem {
  inventoryNo: string;
  qrCode: string | null;
  barCode: string | null;
  rfidTag: string | null;
  location: string | null;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<InventoryItem>({
    inventoryNo: '',
    qrCode: '',
    barCode: '',
    rfidTag: '',
    location: '',
  });

  const columns: Column<InventoryItem>[] = [
    { key: 'inventoryNo', label: 'Inventory No' },
    { key: 'qrCode', label: 'QR Code' },
    { key: 'barCode', label: 'Bar Code' },
    { key: 'rfidTag', label: 'RFID Tag' },
    { key: 'location', label: 'Location' },
  ];

  // Handle edit from table - populates form
  const handleEdit = (index: number, row: InventoryItem) => {
    setEditingIndex(index);
    setFormData({ ...row });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete from table
  const handleDelete = (indices: number[]) => {
    setInventory((prev) => prev.filter((_, i) => !indices.includes(i)));
  };

  // Handle add/update from form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingIndex !== null) {
      setInventory((prev) =>
        prev.map((item, i) => (i === editingIndex ? formData : item)),
      );
      setEditingIndex(null);
    } else {
      setInventory((prev) => [...prev, formData]);
    }

    setFormData({
      inventoryNo: '',
      qrCode: '',
      barCode: '',
      rfidTag: '',
      location: '',
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      inventoryNo: '',
      qrCode: '',
      barCode: '',
      rfidTag: '',
      location: '',
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingIndex !== null ? 'Edit Record' : 'Add New Record'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inventory No */}
              <div className="space-y-2">
                <Label htmlFor="inventoryNo">Inventory No</Label>
                <Input
                  id="inventoryNo"
                  type="text"
                  placeholder="Enter inventory number"
                  value={formData.inventoryNo}
                  onChange={(e) =>
                    setFormData({ ...formData, inventoryNo: e.target.value })
                  }
                  required
                />
              </div>

              {/* QR Code */}
              <div className="space-y-2">
                <Label htmlFor="qrCode">QR Code</Label>
                <Input
                  id="qrCode"
                  type="text"
                  placeholder="Enter QR code"
                  value={formData.qrCode || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, qrCode: e.target.value })
                  }
                />
              </div>

              {/* Bar Code */}
              <div className="space-y-2">
                <Label htmlFor="barCode">Bar Code</Label>
                <Input
                  id="barCode"
                  type="text"
                  placeholder="Enter bar code"
                  value={formData.barCode || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, barCode: e.target.value })
                  }
                />
              </div>

              {/* RFID Tag */}
              <div className="space-y-2">
                <Label htmlFor="rfidTag">RFID Tag</Label>
                <Input
                  id="rfidTag"
                  type="text"
                  placeholder="Enter RFID tag"
                  value={formData.rfidTag || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rfidTag: e.target.value })
                  }
                />
              </div>

              {/* Location */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter location"
                  value={formData.location || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {editingIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {editingIndex !== null ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Reusable FormTable */}
      <FormTable
        data={inventory}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectable={true}
        tableTitle="Inventory Records"
        emptyMessage="No inventory items found"
      />
    </div>
  );
}
