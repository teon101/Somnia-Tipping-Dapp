"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

interface ProfileSectionProps {
  contract: any
  account: string
}

export default function ProfileSection({ contract, account }: ProfileSectionProps) {
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profileExists, setProfileExists] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [contract, account])

  const loadProfile = async () => {
    if (!contract || !account) return

    try {
      setLoading(true)
      setError("")

      // Get the user's profile from the contract
      const profile = await contract.getProfile(account)

      // Check if profile exists
      if (profile.username) {
        setUsername(profile.username)
        setBio(profile.bio)
        setProfileImage(profile.profileImage)
        setProfileExists(true)
      }
    } catch (err) {
      console.error("Error loading profile:", err)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!username) {
      setError("Username is required")
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      // Save the profile to the contract
      const tx = await contract.updateProfile(username, bio, profileImage)

      // Wait for the transaction to be mined
      await tx.wait()

      // Show success message
      setSuccess("Profile updated successfully")
      setProfileExists(true)

      // Show toast notification
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(err.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const copyProfileLink = () => {
    const profileLink = `${window.location.origin}/tip/${account}`
    navigator.clipboard.writeText(profileLink)

    toast({
      title: "Link Copied",
      description: "Your tipping link has been copied to clipboard",
    })
  }

  const openProfilePage = () => {
    window.open(`/tip/${account}`, "_blank")
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Customize your tipping profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">This will be your public username for receiving tips</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input
                  id="profileImage"
                  placeholder="https://example.com/your-image.jpg"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">Enter a URL to your profile image</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveProfile} disabled={loading || saving || !username}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
          <CardDescription>How others will see you</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            {profileImage ? <AvatarImage src={profileImage || "/placeholder.svg"} alt={username} /> : null}
            <AvatarFallback className="text-2xl">{getInitials(username)}</AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-bold">{username || "Your Username"}</h3>

          {bio ? (
            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">{bio}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2 italic">No bio yet</p>
          )}

          <div className="w-full mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Your Tipping Link</h4>
            {profileExists ? (
              <>
                <div className="flex items-center justify-between bg-muted p-2 rounded-md mb-3">
                  <code className="text-xs truncate max-w-[180px]">
                    {window.location.origin}/tip/{account}
                  </code>
                  <Button variant="ghost" size="icon" onClick={copyProfileLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={openProfilePage}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Save your profile to get your tipping link</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
