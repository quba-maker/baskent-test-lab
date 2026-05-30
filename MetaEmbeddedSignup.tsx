"use client";

import React, { useState } from 'react';
import { Facebook, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { processMetaEmbeddedSignup } from '@/app/actions/meta-onboarding';

interface MetaEmbeddedSignupProps {
  botGroupId: string;
  onSuccess: () => void;
}

export function MetaEmbeddedSignup({ botGroupId, onSuccess }: MetaEmbeddedSignupProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const launchMetaSignup = () => {
    setLoading(true);
    setError(null);

    // @ts-ignore
    if (typeof FB === 'undefined') {
      setError("Meta SDK yüklenemedi. Lütfen reklam engelleyicinizi kapatın.");
      setLoading(false);
      return;
    }

    // @ts-ignore
    FB.login((response: any) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        
        // Bu noktada Meta Embedded Signup popup'ı açılır.
        // Şimdilik simüle ediyoruz:
        handleSignupSuccess(accessToken);
      } else {
        setError("Meta girişi iptal edildi veya başarısız oldu.");
        setLoading(false);
      }
    }, {
      scope: 'whatsapp_business_management,whatsapp_business_messaging,pages_messaging,pages_show_list,instagram_basic,instagram_manage_messages',
      extras: {
        feature: 'whatsapp_embedded_signup',
        // setup: { ... } // Buraya Meta App ID ve diğer configler gelir
      }
    });
  };

  const handleSignupSuccess = async (token: string) => {
    setStatus('processing');
    try {
      const res = await processMetaEmbeddedSignup({
        accessToken: token,
        botGroupId: botGroupId
      });

      if (res.success) {
        setStatus('success');
        setTimeout(onSuccess, 2000);
      } else {
        setError(res.error || "Bağlantı işlenirken bir hata oluştu.");
        setStatus('idle');
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg">
          <Facebook className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-gray-900">Meta ile Hızlı Bağlan</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            WhatsApp, Instagram ve Messenger hesaplarınızı tek tıkla, manuel onay beklemeden bağlayın.
          </p>
        </div>

        {status === 'idle' && (
          <button
            onClick={launchMetaSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bağlantıyı Başlat"}
          </button>
        )}

        {status === 'processing' && (
          <div className="flex items-center gap-2 text-[#1877F2] font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            Hesaplarınız yapılandırılıyor...
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <CheckCircle2 className="w-6 h-6" />
            Başarıyla Bağlandı!
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <p className="text-[10px] text-gray-400">
          Bu işlem Meta tarafından doğrulanmış güvenli bir akıştır. Şifreleriniz asla saklanmaz.
        </p>
      </div>
    </div>
  );
}
