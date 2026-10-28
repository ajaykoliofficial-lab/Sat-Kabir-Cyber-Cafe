import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  Building,
  RotateCcw,
} from 'lucide-react';
import { InvoiceItem } from '../types/csc';

interface BillingToolProps {
  currentLang: 'hi' | 'en';
}

export const BillingTool: React.FC<BillingToolProps> = ({ currentLang }) => {
  const [customerName, setCustomerName] = useState('Ramesh Kumar');
  const [customerMobile, setCustomerMobile] = useState('9812345678');
  const [receiptNumber, setReceiptNumber] = useState(`SK-${Date.now().toString().slice(-6)}`);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', serviceName: 'New PAN Card Application (NSDL)', qty: 1, rate: 120 },
    { id: '2', serviceName: 'Color Printout & Lamination', qty: 2, rate: 25 },
  ]);

  const quickPresets = [
    { name: 'New PAN Card', rate: 120 },
    { name: 'Income Certificate Apply', rate: 60 },
    { name: 'Color Printout', rate: 10 },
    { name: 'Aadhaar PVC Print', rate: 50 },
    { name: 'Lamination A4', rate: 20 },
    { name: 'Electricity Bill Payment', rate: 20 },
  ];

  const handleAddItem = (name = 'New Service Item', rate = 50) => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      serviceName: name,
      qty: 1,
      rate,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: 'serviceName' | 'qty' | 'rate', value: string | number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.rate, 0);

  return (
    <section id="billing-tool" className="py-14 bg-slate-100 border-t border-slate-200 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'सीएससी बिलिंग एवं रसीद सॉफ्टवेयर' : 'CSC Invoice & Receipt Tool'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-hindi">
            {currentLang === 'hi' ? 'त्वरित नागरिक सेवा रसीद जनरेटर' : 'Quick Customer Receipt Generator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-hindi">
            {currentLang === 'hi'
              ? 'ग्राहकों को दी गई सेवाओं का विवरण जोड़ें और तुरंत डिजिटल या प्रिंटेड रसीद जारी करें।'
              : 'Add services delivered to customers and print an official branded receipt with one click.'}
          </p>
        </div>

        {/* Invoice Generator Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm">
          {/* Top Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pb-5 border-b border-slate-100">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
              </label>
              <input
                type="tel"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-data text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'रसीद संख्या (Receipt #)' : 'Receipt Number'}
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-data text-blue-900 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="py-3 border-b border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold">
              {currentLang === 'hi' ? 'त्वरित जोड़ें:' : 'Quick Add:'}
            </span>
            {quickPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleAddItem(preset.name, preset.rate)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + {preset.name} (₹{preset.rate})
              </button>
            ))}
          </div>

          {/* Items Table */}
          <div className="py-4 space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-slate-400 px-2">
              <span className="col-span-6">{currentLang === 'hi' ? 'सेवा का विवरण' : 'Service Description'}</span>
              <span className="col-span-2 text-center">{currentLang === 'hi' ? 'मात्रा' : 'Qty'}</span>
              <span className="col-span-2 text-center">{currentLang === 'hi' ? 'दर (₹)' : 'Rate (₹)'}</span>
              <span className="col-span-2 text-right">{currentLang === 'hi' ? 'कुल' : 'Total'}</span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200"
              >
                <div className="col-span-6 flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={item.serviceName}
                    onChange={(e) => handleUpdateItem(item.id, 'serviceName', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleUpdateItem(item.id, 'qty', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-center text-xs font-bold font-data text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => handleUpdateItem(item.id, 'rate', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-center text-xs font-bold font-data text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 text-right pr-2">
                  <span className="text-xs font-black font-data text-slate-900">
                    ₹{item.qty * item.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom item button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => handleAddItem()}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-900 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'अन्य सेवा जोड़ें' : 'Add Custom Service'}</span>
            </button>

            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                {currentLang === 'hi' ? 'कुल देय राशि:' : 'Total Payable:'}
              </span>
              <span className="text-2xl font-black font-data text-emerald-700">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          {/* PRINTABLE RECEIPT PREVIEW */}
          <div className="mt-6 p-6 rounded-2xl bg-white border-2 border-slate-300 shadow-inner text-slate-900 print:shadow-none">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-base font-black text-blue-900 tracking-tight">
                  SAT KABIR CSC CENTER
                </h4>
                <p className="text-[11px] text-slate-500">
                  CSC VLE ID: 419208310023 · Digital Seva Kendra
                </p>
                <p className="text-[10px] text-slate-400">
                  Main Road, Near Bus Stand · Phone: +91 98765-43210
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded font-data">
                  {receiptNumber}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-data">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="my-3 text-xs flex justify-between">
              <div>
                <span className="text-slate-500">{currentLang === 'hi' ? 'ग्राहक:' : 'Customer:'}</span>{' '}
                <strong>{customerName}</strong>
              </div>
              <div>
                <span className="text-slate-500">{currentLang === 'hi' ? 'मोबाइल:' : 'Phone:'}</span>{' '}
                <strong className="font-data">{customerMobile}</strong>
              </div>
            </div>

            <div className="border-t border-b border-slate-200 py-2 space-y-1 text-xs">
              {items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>
                    {it.serviceName} (×{it.qty})
                  </span>
                  <span className="font-data font-semibold">₹{it.qty * it.rate}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 font-bold text-sm">
              <span className="text-emerald-700 flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID / भुगतान प्राप्त
              </span>
              <span className="font-data text-base text-slate-900">Total: ₹{totalAmount}</span>
            </div>

            <p className="text-[9px] text-center text-slate-400 mt-4 border-t border-slate-100 pt-2 font-hindi">
              यह रसीद सत कबीर सीएससी केंद्र द्वारा कंप्यूटर द्वारा जनरेट की गई है। पधारने हेतु धन्यवाद!
            </p>
          </div>

          {/* Action to print */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{currentLang === 'hi' ? 'रसीद प्रिंट करें' : 'Print Customer Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
