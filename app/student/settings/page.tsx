'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useStudentId } from '@/lib/hooks/useStudentId';
import {
  getGuardiansByStudentId,
  createGuardian,
  updateGuardian,
  deleteGuardian,
} from '@/lib/services/guardians';
import { StudentGuardian } from '@/lib/types';
import { UserPlus, Pencil, Trash2, Loader2, Mail, Phone } from 'lucide-react';
import { SimplePageSkeleton } from '@/components/skeletons/SimplePageSkeleton';

export default function StudentSettingsPage() {
  const router = useRouter();
  const { studentId: userId, loading: authLoading, error: authError } = useStudentId();
  const [guardians, setGuardians] = useState<StudentGuardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<StudentGuardian | null>(null);

  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRelationship, setAddRelationship] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRelationship, setEditRelationship] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      if (!authLoading) {
        setError('Not signed in');
        router.replace('/auth/signin');
      }
      setLoading(false);
      return;
    }
    const load = async () => {
      const { data, error: err } = await getGuardiansByStudentId(userId);
      if (err) {
        setError(err.message);
      } else {
        setGuardians(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [userId, authLoading, router]);

  const refreshGuardians = async () => {
    if (!userId) return;
    const { data } = await getGuardiansByStudentId(userId);
    setGuardians(data ?? []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const result = await createGuardian(addEmail.trim(), addRelationship.trim() || undefined, addPhone.trim() || undefined);
    setSaving(false);
    if (result.error) {
      setSaveError(result.error.message);
      return;
    }
    setAddEmail('');
    setAddPhone('');
    setAddRelationship('');
    setAddOpen(false);
    await refreshGuardians();
  };

  const openEdit = (g: StudentGuardian) => {
    setEditingGuardian(g);
    setEditEmail(g.email);
    setEditPhone(g.phone ?? '');
    setEditRelationship(g.relationship ?? '');
    setSaveError(null);
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuardian) return;
    setSaving(true);
    setSaveError(null);
    const result = await updateGuardian(editingGuardian.id, {
      email: editEmail.trim(),
      phone: editPhone.trim() || undefined,
      relationship: editRelationship.trim() || undefined,
    });
    setSaving(false);
    if (result.error) {
      setSaveError(result.error.message);
      return;
    }
    setEditingGuardian(null);
    setEditOpen(false);
    await refreshGuardians();
  };

  const handleDelete = async (g: StudentGuardian) => {
    if (!confirm(`Remove ${g.email} from your guardians?`)) return;
    const result = await deleteGuardian(g.id);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    await refreshGuardians();
  };

  if (authLoading || loading) {
    return <SimplePageSkeleton />;
  }

  if (!userId) {
    return null;
  }

  if (authError || error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{authError ?? error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and guardian contacts.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Parent / Guardian Contacts</CardTitle>
              <CardDescription>
                Add parents or guardians so your teacher can send your assignment and test results by email.
                Only you can add or edit these contacts.
              </CardDescription>
            </div>
            <Button onClick={() => { setAddOpen(true); setSaveError(null); }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Guardian
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {guardians.length === 0 ? (
            <p className="text-muted-foreground text-sm">No guardians added yet. Add one so your teacher can email results.</p>
          ) : (
            <ul className="space-y-3">
              {guardians.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{g.email}</p>
                      {g.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {g.phone}
                        </p>
                      )}
                      {g.relationship && (
                        <p className="text-xs text-muted-foreground">{g.relationship}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEdit(g)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(g)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogClose onClose={() => setAddOpen(false)} />
          <DialogHeader>
            <DialogTitle>Add Guardian</DialogTitle>
            <DialogDescription>
              Add a parent or guardian email. Your teacher can send your results to this address.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="guardian@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone (optional)</Label>
                <Input
                  id="add-phone"
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-relationship">Relationship (optional)</Label>
                <Input
                  id="add-relationship"
                  value={addRelationship}
                  onChange={(e) => setAddRelationship(e.target.value)}
                  placeholder="e.g. Parent, Guardian"
                />
              </div>
            </div>
            {saveError && <p className="text-sm text-destructive mt-2">{saveError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !addEmail.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogClose onClose={() => setEditOpen(false)} />
          <DialogHeader>
            <DialogTitle>Edit Guardian</DialogTitle>
            <DialogDescription>Update this guardian&apos;s contact info.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="guardian@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone (optional)</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-relationship">Relationship (optional)</Label>
                <Input
                  id="edit-relationship"
                  value={editRelationship}
                  onChange={(e) => setEditRelationship(e.target.value)}
                  placeholder="e.g. Parent, Guardian"
                />
              </div>
            </div>
            {saveError && <p className="text-sm text-destructive mt-2">{saveError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
