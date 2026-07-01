'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Share2, Loader2 } from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.getStudentCertificates().then(setCertificates).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-screen bg-background"><Sidebar /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your earned certifications and credentials</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-2xl font-semibold tracking-tight">{certificates.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Excellence</p><p className="text-2xl font-semibold tracking-tight">{certificates.filter(c => c.type === 'excellence').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Achievement</p><p className="text-2xl font-semibold tracking-tight">{certificates.filter(c => c.type === 'achievement').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Completion</p><p className="text-2xl font-semibold tracking-tight">{certificates.filter(c => c.type === 'completion').length}</p></CardContent></Card>
          </div>
          {certificates.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><p className="text-sm text-muted-foreground">No certificates yet. Score well on tests to earn certificates!</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id} className="cursor-pointer hover:border-foreground transition-colors overflow-hidden hover-lift" onClick={() => setSelected(cert)}>
                  <div className={`p-6 relative ${cert.type === 'excellence' ? 'bg-gradient-to-br from-amber-50 to-orange-50' : cert.type === 'achievement' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5" />
                      <Badge variant="outline" className="text-[10px]">{cert.type}</Badge>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Certificate</p>
                    <h3 className="text-sm font-semibold leading-tight">{cert.title}</h3>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground mb-3">{cert.subject}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{cert.issued_date ? new Date(cert.issued_date).toLocaleDateString() : ''}</span>
                      <span className="font-mono font-semibold">{cert.score}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[3px] flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="bg-background rounded-lg max-w-2xl w-full overflow-hidden border border-border" onClick={e => e.stopPropagation()}>
            <div className="bg-foreground text-background p-12 text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <p className="text-[11px] uppercase tracking-widest opacity-60 mb-2">Certificate of {selected.type}</p>
              <h2 className="text-2xl font-semibold tracking-tight">{selected.title}</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-xs text-muted-foreground mb-2">Awarded to</p>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{user?.full_name}</h3>
              <p className="text-sm text-muted-foreground mb-1">for completing <span className="font-medium text-foreground">{selected.subject}</span></p>
              <p className="text-sm text-muted-foreground mb-6">with a score of <span className="font-semibold text-foreground">{selected.score}%</span></p>
              <Button onClick={() => setSelected(null)} className="w-full">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
