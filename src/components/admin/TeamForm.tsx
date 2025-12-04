import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function TeamForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('teams').insert({
        name: name.trim(),
        description: description.trim() || null,
        logo_url: logoUrl.trim() || null,
      });

      if (error) throw error;

      toast({
        title: 'Team created!',
        description: `${name} has been added to the leaderboard.`,
      });

      // Reset form
      setName('');
      setDescription('');
      setLogoUrl('');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create team',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" aria-hidden="true" />
        Add New Team
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team-name">Team Name *</Label>
          <Input
            id="team-name"
            placeholder="Enter team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-description">Description</Label>
          <Textarea
            id="team-description"
            placeholder="Brief team description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={500}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-logo">Logo URL</Label>
          <Input
            id="team-logo"
            type="url"
            placeholder="https://example.com/logo.png (optional)"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={loading || !name.trim()}>
          {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          Add Team
        </Button>
      </form>
    </div>
  );
}
