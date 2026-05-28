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
  const studentName = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('adaptlearn_current_user') || '{}').full_name) || 'Rajesh Kumar';
  const dateStr = new Date(cert.issued_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Generate PDF using canvas-based approach
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 850);

  // Border
  ctx.strokeStyle = '#d4a574';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, 1140, 790);
  ctx.strokeStyle = '#5c7f63';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 1110, 760);

  // Header
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI', 600, 100);

  ctx.fillStyle = '#5c7f63';
  ctx.font = '12px Arial';
  ctx.fillText('ADAPTIVE LEARNING PLATFORM', 600, 125);

  // Certificate type
  ctx.fillStyle = '#b8956b';
  ctx.font = '16px Arial';
  ctx.fillText(`CERTIFICATE OF ${cert.type.toUpperCase()}`, 600, 200);

  // Decorative line
  ctx.strokeStyle = '#d4a574';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(350, 220);
  ctx.lineTo(850, 220);
  ctx.stroke();

  // Title
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 36px Georgia';
  ctx.fillText(cert.title, 600, 290);

  // Awarded to
  ctx.fillStyle = '#666666';
  ctx.font = '14px Arial';
  ctx.fillText('This is to certify that', 600, 360);

  // Student name
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 28px Georgia';
  ctx.fillText(studentName, 600, 410);

  // Description
  ctx.fillStyle = '#666666';
  ctx.font = '14px Arial';
  ctx.fillText(`has successfully completed ${cert.subject}`, 600, 470);
  ctx.fillText(`with a score of ${cert.score}%`, 600, 500);

  // Date
  ctx.fillStyle = '#888888';
  ctx.font = 'italic 13px Arial';
  ctx.fillText(dateStr, 600, 570);

  // Footer
  ctx.strokeStyle = '#d4a574';
  ctx.beginPath();
  ctx.moveTo(200, 650);
  ctx.lineTo(500, 650);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(700, 650);
  ctx.lineTo(1000, 650);
  ctx.stroke();

  ctx.fillStyle = '#666666';
  ctx.font = '11px Arial';
  ctx.fillText('Platform Director', 350, 680);
  ctx.fillText('Head of Department', 850, 680);

  // AdaptLearn branding
  ctx.fillStyle = '#999999';
  ctx.font = '10px Arial';
  ctx.fillText('AdaptLearn © 2026 | Powered by AI', 600, 780);

  // Convert to PDF-like blob and download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.title.replace(/\s+/g, '_')}_Certificate.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
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
    // Load from mockDB or use dummy data for display
    const mockCerts = user ? mockDB.getCertificates(user.id) : [];
    if (mockCerts.length > 0) {
      setCertificates(mockCerts);
    } else {
      // Dummy certificates to show how it looks
      setCertificates([
        { id: 1, user_id: 1, title: 'Cloud Computing Mastery', subject: 'BCS601 - Cloud Computing', type: 'excellence', score: 94, issued_date: '2026-05-20T10:00:00Z' },
        { id: 2, user_id: 1, title: 'Machine Learning Foundations', subject: 'BCS602 - Machine Learning', type: 'achievement', score: 88, issued_date: '2026-05-15T10:00:00Z' },
        { id: 3, user_id: 1, title: 'Data Structures Expert', subject: 'BCS304 - DSA', type: 'excellence', score: 96, issued_date: '2026-04-28T10:00:00Z' },
        { id: 4, user_id: 1, title: 'Operating Systems', subject: 'BCS303 - Operating Systems', type: 'completion', score: 78, issued_date: '2026-04-10T10:00:00Z' },
        { id: 5, user_id: 1, title: 'Algorithm Design', subject: 'BCS401 - ADA', type: 'achievement', score: 85, issued_date: '2026-03-22T10:00:00Z' },
        { id: 6, user_id: 1, title: 'Database Systems', subject: 'BCS403 - DBMS', type: 'excellence', score: 92, issued_date: '2026-03-05T10:00:00Z' },
        { id: 7, user_id: 1, title: 'Computer Networks', subject: 'BCS502 - CN', type: 'completion', score: 75, issued_date: '2026-02-18T10:00:00Z' },
        { id: 8, user_id: 1, title: 'Cryptography & Security', subject: 'BCS604 - CNS', type: 'achievement', score: 82, issued_date: '2026-02-01T10:00:00Z' },
      ]);
    }
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
                className="cursor-pointer hover:border-foreground transition-colors overflow-hidden hover-lift"
                onClick={() => setSelected(cert)}
              >
                <div className={`p-6 relative ${
                  cert.type === 'excellence' ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900' :
                  cert.type === 'achievement' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-900' :
                  'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5" />
                    <Badge variant="outline" className={`text-[10px] ${
                      cert.type === 'excellence' ? 'border-amber-200 bg-amber-100/50 text-amber-700' :
                      cert.type === 'achievement' ? 'border-emerald-200 bg-emerald-100/50 text-emerald-700' :
                      'border-blue-200 bg-blue-100/50 text-blue-700'
                    }`}>
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
          className="fixed inset-0 bg-white/50 backdrop-blur-[3px] flex items-center justify-center z-50 p-4 animate-fade-in"
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
