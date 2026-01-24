'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { getClassById, generateClassCode } from '@/lib/mock-data';
import { Class } from '@/lib/types';

export default function ClassSettingsPage() {
  const params = useParams();
  const classId = params.classId as string;
  const classData = getClassById(classId);
  const [name, setName] = useState(classData?.name || '');
  const [description, setDescription] = useState(classData?.description || '');
  const [classCode, setClassCode] = useState(classData?.class_code || '');
  const [invitationMethod, setInvitationMethod] = useState<'code' | 'email' | 'both'>(
    classData?.settings?.invitation_method || 'both'
  );
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(
    classData?.settings?.allow_self_enrollment ?? true
  );

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Class not found</p>
        <Link href="/teacher/classes">
          <Button variant="outline" className="mt-4">
            Back to Classes
          </Button>
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would be an API call
    alert('Settings saved!');
  };

  const handleRegenerateCode = () => {
    if (confirm('Are you sure you want to generate a new class code? The old code will no longer work.')) {
      setClassCode(generateClassCode());
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/classes/${classId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Class Settings</h2>
          <p className="text-muted-foreground">{classData.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Update class name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Code</CardTitle>
          <CardDescription>Manage the class code students use to join</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classCode">Class Code *</Label>
            <div className="flex gap-2">
              <Input
                id="classCode"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="font-mono"
                required
              />
              <Button variant="outline" onClick={handleRegenerateCode}>
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Students will use this code to join your class
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invitation Settings</CardTitle>
          <CardDescription>Configure how students can join your class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invitationMethod">Invitation Method</Label>
            <Select
              value={invitationMethod}
              onValueChange={(value: 'code' | 'email' | 'both') => setInvitationMethod(value)}
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
              onCheckedChange={(checked) => setAllowSelfEnrollment(checked === true)}
            />
            <Label htmlFor="selfEnrollment" className="text-sm font-normal cursor-pointer">
              Allow students to join using class code
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href={`/teacher/classes/${classId}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
