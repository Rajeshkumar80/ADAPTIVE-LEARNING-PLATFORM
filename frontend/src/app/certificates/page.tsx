'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockDB, Certificate } from '@/lib/mockdb';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Share2 } from 'lucide-react';

function downloadCertificate(cert: Certificate) {
  const content = `CERTIFICATE OF ${cert.type.toUpperCase()}

This certifies that
${(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('adaptlearn_current_user') || '{}').full_name) || 'Student'}

has successfully completed
${cert.title}

Subject: ${cert.subject}
Score: ${cert.score}%
Issued: ${new Date(cert.issued_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

— AdaptLearn 2026 —`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cert.title.replace(/\s+/g, '_')}_Certificate.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function shareCertificate(cert: Certificate) {
  const text = `I just earned my "${cert.title}" certificate on AdaptLearn with a score of ${cert.score}%! 🎓`;
  if (navigator.share) {
    navigator.share({
      title: cert.title,
      text,
      url: window.location.href,
    }).catch(() => copyToClipboard(text));
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Certificate details copied to clipboard');
  }).catch(() => {
    alert(`Share this:\n\n${text}`);
  });
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) setCertificates(mockDB.getCertificates(user.id));
  }, [user]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your earned certifications and credentials
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-2xl font-semibold tracking-tight">{certificates.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Excellence</p><p className="text-2xl font-semibold tracking-tight">{certificates.filter(c => c.type === 'excellence').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Achievement</p><p className="text-2xl font-semibold tracking-tight">{certificates.filter(c => c.type === 'achievement').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Completion</p><p className="text-2xl font-semibold tracking-tight">{certificates.filter(c => c.type === 'completion').length}</p></CardContent></Card>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="cursor-pointer hover:border-foreground transition-colors overflow-hidden"
                onClick={() => setSelected(cert)}
              >
                <div className="bg-foreground text-background p-6 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5" />
                    <Badge variant="outline" className="text-[10px] border-background/20 bg-background/10 text-background">
                      {cert.type}
                    </Badge>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Certificate</p>
                  <h3 className="text-sm font-semibold leading-tight">{cert.title}</h3>
                </div>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-3">{cert.subject}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {new Date(cert.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-mono font-semibold">{cert.score}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-background rounded-lg max-w-2xl w-full overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-foreground text-background p-12 text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <p className="text-[11px] uppercase tracking-widest opacity-60 mb-2">Certificate of {selected.type}</p>
              <h2 className="text-2xl font-semibold tracking-tight">{selected.title}</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-xs text-muted-foreground mb-2">Awarded to</p>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{user?.full_name}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                for completing <span className="font-medium text-foreground">{selected.subject}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                with a score of <span className="font-semibold text-foreground">{selected.score}%</span>
              </p>
              <p className="text-xs text-muted-foreground mb-8 font-mono">
                {new Date(selected.issued_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => downloadCertificate(selected)}>
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => shareCertificate(selected)}>
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
