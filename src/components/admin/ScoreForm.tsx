import { useState } from 'react';
import { Zap, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Team } from '@/types';

interface ScoreFormProps {
  teams: Team[];
}

export function ScoreForm({ teams }: ScoreFormProps) {
  const [teamId, setTeamId] = useState('');
  const [points, setPoints] = useState('');
  const [isPositive, setIsPositive] = useState(true);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const pointValue = isPositive ? Math.abs(parseInt(points)) : -Math.abs(parseInt(points));

    try {
      const { error } = await supabase.from('score_events').insert({
        team_id: teamId,
        points: pointValue,
        reason: reason.trim(),
      });

      if (error) throw error;

      const teamName = teams.find((t) => t.id === teamId)?.name || 'Team';
      
      toast({
        title: 'Score updated!',
        description: `${pointValue >= 0 ? '+' : ''}${pointValue} points for ${teamName}`,
      });

      // Reset form
      setTeamId('');
      setPoints('');
      setReason('');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add score',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
        Add Score Event
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="score-team">Team *</Label>
          <Select value={teamId} onValueChange={setTeamId} required>
            <SelectTrigger id="score-team">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name} ({team.total_points} pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score-points">Points *</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isPositive ? 'default' : 'outline'}
              size="icon"
              onClick={() => setIsPositive(true)}
              aria-label="Add points"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={!isPositive ? 'destructive' : 'outline'}
              size="icon"
              onClick={() => setIsPositive(false)}
              aria-label="Subtract points"
              className="shrink-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="score-points"
              type="number"
              placeholder="Enter points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              min="1"
              max="10000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score-reason">Reason *</Label>
          <Textarea
            id="score-reason"
            placeholder="Why are these points being awarded?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={2}
            maxLength={500}
          />
        </div>

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={loading || !teamId || !points || !reason.trim()}
        >
          {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          ) : (
            <Zap className="h-4 w-4" aria-hidden="true" />
          )}
          Award Points
        </Button>
      </form>
    </div>
  );
}
