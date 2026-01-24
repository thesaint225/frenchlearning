'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnnouncementCard } from '@/components/teacher/Announcements/AnnouncementCard';
import { CreateAnnouncementDialog } from '@/components/teacher/Announcements/CreateAnnouncementDialog';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  getClassById,
  getAnnouncementsByClass,
  getAnnouncementById,
} from '@/lib/mock-data';
import { Announcement } from '@/lib/types';

export default function AnnouncementsPage() {
  const params = useParams();
  const classId = params.classId as string;
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    getAnnouncementsByClass(classId)
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const classData = getClassById(classId);

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

  const handleCreateAnnouncement = (
    announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `announcement-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateAnnouncement = (
    announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
  ) => {
    if (editingAnnouncement) {
      const updatedAnnouncement: Announcement = {
        ...announcementData,
        id: editingAnnouncement.id,
        created_at: editingAnnouncement.created_at,
        updated_at: new Date().toISOString(),
      };
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingAnnouncement.id ? updatedAnnouncement : a
        )
      );
      setEditingAnnouncement(null);
    }
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter((a) => a.id !== announcementId));
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setEditingAnnouncement(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/teacher/classes/${classId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Announcements</h2>
            <p className="text-muted-foreground">{classData.name}</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No announcements yet.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Announcement
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
            />
          ))}
        </div>
      )}

      <CreateAnnouncementDialog
        open={isCreateDialogOpen}
        onOpenChange={handleDialogClose}
        onCreateAnnouncement={
          editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement
        }
        editingAnnouncement={editingAnnouncement}
      />
    </div>
  );
}
