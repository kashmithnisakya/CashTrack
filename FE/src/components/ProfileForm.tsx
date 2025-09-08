import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, Save } from "lucide-react";
import { Profile, UpdateProfileRequest } from '@/types/api';

interface ProfileFormProps {
  profile: Profile | null;
  onSubmit: (profileData: UpdateProfileRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProfileForm({ profile, onSubmit, onCancel, loading = false }: ProfileFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData: UpdateProfileRequest = {
        first_name: firstName.trim(),
        last_name: lastName.trim()
      };

      await onSubmit(profileData);
      onCancel(); // Close the form on success
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="relative pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Edit Profile
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {profile?.email && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={isSubmitting || loading}
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
                disabled={isSubmitting || loading}
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || loading || !firstName.trim() || !lastName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}