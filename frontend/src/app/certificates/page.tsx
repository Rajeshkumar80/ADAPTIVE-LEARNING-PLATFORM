'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockDB, Certificate } from '@/lib/mockdb';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Share2, Eye, Trophy, Star, CheckCircle2 } from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    if (user) {
      const certs = mockDB.getCertificates(user.id);
      setCertificates(certs);
    }
  }, [user]);

  const typeStyles = {
    completion: 'from-blue-500 to-indigo-600',
    achievement: 'from-purple-500 to-pink-600',
    excellence: 'from-yellow-400 via-orange-500 to-red-500',
  };

  const typeIcons = {
    completion: CheckCircle2,
    achievement: Trophy,
    excellence: Star,
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Certificates" subtitle="Your earned certifications and credentials" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border shadow-none bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-5">
                <Award className="w-5 h-5 text-yellow-600 mb-2" />
                <p className="text-2xl font-bold">{certificates.length}</p>
                <p className="text-xs text-gray-600">Total Certificates</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Star className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-2xl font-bold">{certificates.filter(c => c.type === 'excellence').length}</p>
                <p className="text-xs text-gray-600">Excellence</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Trophy className="w-5 h-5 text-purple-500 mb-2" />
                <p className="text-2xl font-bold">{certificates.filter(c => c.type === 'achievement').length}</p>
                <p className="text-xs text-gray-600">Achievement</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{certificates.filter(c => c.type === 'completion').length}</p>
                <p className="text-xs text-gray-600">Completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const Icon = typeIcons[cert.type];
              return (
                <div
                  key={cert.id}
                  className="group relative bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                >
                  {/* Certificate Design */}
                  <div className={`h-40 bg-gradient-to-br ${typeStyles[cert.type]} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="relative h-full flex flex-col items-center justify-center text-white">
                      <Icon className="w-12 h-12 mb-2" />
                      <p className="text-xs uppercase tracking-wider opacity-80">Certificate of {cert.type}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold mb-1">{cert.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{cert.subject}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Score</p>
                        <p className="font-bold text-lg">{cert.score}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase">Issued</p>
                        <p className="text-sm font-medium">
                          {new Date(cert.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {certificates.length === 0 && (
            <Card className="border shadow-none">
              <CardContent className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No certificates yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Complete tests and courses to earn certificates
                </p>
                <Button>Browse Courses</Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-64 bg-gradient-to-br ${typeStyles[selectedCert.type]} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-32 h-32 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-48 h-48 border-2 border-white rounded-full"></div>
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-6">
                <Award className="w-16 h-16 mb-3" />
                <p className="text-xs uppercase tracking-widest opacity-80">Certificate of {selectedCert.type}</p>
                <h2 className="text-2xl font-bold mt-2">{selectedCert.title}</h2>
              </div>
            </div>
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 mb-2">This certifies that</p>
              <h3 className="text-2xl font-bold mb-2">{user?.full_name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                has successfully completed <strong>{selectedCert.subject}</strong> with a score of <strong>{selectedCert.score}%</strong>
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Issued on {new Date(selectedCert.issued_date).toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </p>
              <div className="flex gap-2 justify-center">
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => setSelectedCert(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
