'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Class } from '@/lib/types';
import { generateClassCode } from '@/lib/mock-data';

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateClass: (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function CreateClassDialog({
  open,
  onOpenChange,
  onCreateClass,
}: CreateClassDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [invitationMethod, setInvitationMethod] = useState<'code' | 'email' | 'both'>('both');
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(true);
  const [classCode, setClassCode] = useState(generateClassCode());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateClass({
      teacher_id: 'teacher1', // In real app, get from auth context
      name,
      description: description || undefined,
      class_code: classCode,
      settings: {
        invitation_method: invitationMethod,
        allow_self_enrollment: allowSelfEnrollment,
      },
    });
    // Reset form
    setName('');
    setDescription('');
    setInvitationMethod('both');
    setAllowSelfEnrollment(true);
    setClassCode(generateClassCode());
    onOpenChange(false);
  };

  const handleGenerateNewCode = () => {
    setClassCode(generateClassCode());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Create a new class and start inviting students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., French 101 - Beginner"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the class..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classCode">Class Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="classCode"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  required
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateNewCode}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Students will use this code to join your class
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invitationMethod">Invitation Method</Label>
              <Select
                value={invitationMethod}
                onValueChange={(value: 'code' | 'email' | 'both') =>
                  setInvitationMethod(value)
                }
              >
                <SelectTrigger id="invitationMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Class Code Only</SelectItem>
                  <SelectItem value="email">Email Invitations Only</SelectItem>
                  <SelectItem value="both">Both Methods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selfEnrollment"
                checked={allowSelfEnrollment}
                onCheckedChange={(checked) =>
                  setAllowSelfEnrollment(checked === true)
                }
              />
              <Label
                htmlFor="selfEnrollment"
                className="text-sm font-normal cursor-pointer"
              >
                Allow students to join using class code
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !classCode}>
              Create Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
