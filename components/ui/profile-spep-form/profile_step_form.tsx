"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AtSign, Plus, X } from "lucide-react";
import {
  shortNameSchema,
  phoneNumberSchema,
  socialLinkSchema,
  profileSchema,
  type ProfileFormData,
} from "./shemas/profile-shemas";
import { ZodError } from "zod";
import { FaPhoneAlt, FaInstagram, FaTelegram, FaDiscord, FaTwitter, FaLinkedin, FaFacebookMessenger } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";
import { Textarea } from "../textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

import { StepDatePicker } from "../step-date-picker/step-date-picker";
import { CountrySelector } from "../country_selector/country_selector";
import { countries } from "../country_selector/country";
import { MapboxAutocomplete } from "./MapBoxAutocomplete";

// Define social platforms with their properties
const socialPlatforms = [
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/username", icon: FaInstagram },
  { value: "twitter", label: "Twitter", placeholder: "https://twitter.com/username", icon: FaTwitter },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", icon: FaLinkedin },
];

const messengerPlatforms = [
  { value: "messenger", label: "Messenger", placeholder: "https://m.me/username", icon: FaFacebookMessenger },
  { value: "telegram", label: "Telegram", placeholder: "https://t.me/username", icon: FaTelegram },
  { value: "discord", label: "Discord", placeholder: "https://discordapp.com/users/user-id", icon: FaDiscord },
];
export default function ProfileCreationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProfileFormData>>({
    shortName: "",
    phoneNumber: "",
    isPublic: false,
    socialLinks: [],
    messengerLinks: [],
    termsAccepted: false,
    showEmail: false,
    showNumber: false,
    experienceLevel: "", // New field
    location: "",        // New field
    bio: "",             // New field
    gender: "",          // New field
    dob: "",             // New field
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  const validateField = (field: keyof ProfileFormData, value: any) => {
    try {
      switch (field) {
        case "shortName":
          shortNameSchema.parse(value);
          break;
        case "phoneNumber":
          phoneNumberSchema.parse(value);
          break;
        case "socialLinks":
          value.forEach((link: { platform: string; url: string }) => socialLinkSchema.parse(link));
          break;
          
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleLinkChange = (type: "socialLinks" | "messengerLinks", index: number, value: string) => {
    const newLinks = [...formData[type]];
    newLinks[index] = { ...newLinks[index], url: value };
    setFormData({ ...formData, [type]: newLinks });
  };
  const handleAddLink = (type: "socialLinks" | "messengerLinks", platformValue: string) => {
    const platform = type === "socialLinks"
      ? socialPlatforms.find((p) => p.value === platformValue)
      : messengerPlatforms.find((p) => p.value === platformValue);

    if (platform) {
      const newLinks = [...formData[type], { platform: platform.value, url: "" }];
      setFormData({ ...formData, [type]: newLinks });
    }
  };

  const handleSocialLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...(formData.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const handleRemoveLink = (type: "socialLinks" | "messengerLinks", index: number) => {
    const newLinks = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newLinks });
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Choose your @public_name</h2>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="shortname"
                value={formData.shortName}
                onChange={(e) => handleInputChange("shortName", e.target.value)}
                className={`pl-10 ${errors.shortName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.shortName && <p className="text-red-500 text-sm">{errors.shortName}</p>}
            
            <div className="flex items-center justify-between">
              <span className="text-muted/95 font-sans">Make profile public for another users</span>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
            </div>

            
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add your contact information</h2>

            <div className="relative">
            <FaPhoneAlt  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <Input
              type="tel"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className={`pl-10 ${errors.phoneNumber ? "border-red-500" : ""}`}
            />
            </div>
           
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            <div className="flex items-center justify-between mt-4">
        <span className="text-white/50 font-sans">Show this number in profile?</span>
        <Switch
          checked={formData.showNumber}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, showNumber: checked }))
          }
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-white/50 font-sans">Show your email in profile?</span>
        <Switch
          checked={formData.showEmail}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, showEmail: checked }))
          }
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Messengers</h3>
        {formData.messengerLinks.map((link, index) => {
          const platformData = messengerPlatforms.find((p) => p.value === link.platform);
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {platformData?.icon &&
                    React.createElement(platformData.icon, { className: "w-5 h-5 text-gray-400" })}

                </div>
                <Input
                  type="url"
                  placeholder={platformData?.placeholder || "https://"}
                  value={link.url}
                  onChange={(e) => handleLinkChange("messengerLinks", index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveLink("messengerLinks", index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Messenger Link
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {messengerPlatforms.map((platform) => (
              <DropdownMenuItem key={platform.value} onClick={() => handleAddLink("messengerLinks", platform.value)}>
                {React.createElement(platform.icon, { className: "w-5 h-5 mr-2 text-gray-400" })}
                {platform.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
          </div>
          
        )
 
      case 3:
        return (
          <div className="space-y-8">
      <h2 className="text-xl font-bold">You bio:</h2>
      <div className="space-y-4">
          
          <Textarea value={formData.bio} 
                  placeholder="Tell here more about yourself..."
                  className="min-h-[125px] bg-card border-[#333] mb-5"
                  onChange={(e) => handleInputChange("bio", e)}/>
          
          
           
          </div>
          <div className="space-y-4">
              <label className="text-lg font-semibold">Date of Birth:</label>
              <StepDatePicker value={formData.dob} onChange={(value) => handleInputChange("dob", value)} />
            
         
            </div>
            <div className="space-y-4">
            <label className="text-lg font-semibold">Place:</label>

              <MapboxAutocomplete
                  accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''}
                  onSelect={(place)=>handleInputChange('location',place)}
              />
            </div>
           
          
          <div className="space-y-4">
            <label className="text-lg font-semibold">Experience level:</label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) => handleInputChange("experienceLevel", value)}
            >
              <SelectTrigger className="w-full bg-black border-[#333] hover:bg-[#111] transition-colors">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent className="bg-black border-[#333]">
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media Links</h3>
        {formData.socialLinks.map((link, index) => {
          const platformData = socialPlatforms.find((p) => p.value === link.platform);
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {platformData?.icon &&
                    React.createElement(platformData.icon, { className: "w-5 h-5 text-gray-400" })}
                  <span className="text-gray-500">{platformData?.label || "Platform"}</span>
                </div>
                <Input
                  type="url"
                  placeholder={platformData?.placeholder || "https://"}
                  value={link.url}
                  onChange={(e) => handleLinkChange("socialLinks", index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveLink("socialLinks", index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Social Media Link
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {socialPlatforms.map((platform) => (
              <DropdownMenuItem key={platform.value} onClick={() => handleAddLink("socialLinks", platform.value)}>
                {React.createElement(platform.icon, { className: "w-5 h-5 mr-2 text-gray-400" })}
                {platform.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messenger Links */}
    
    </div>
        );

        case 4:
        return (
          <div className="space-y-4">
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Terms and Conditions</h3>
              <div className="bg-gray-800 p-4 rounded-md max-h-40 overflow-y-auto mb-4">
                <p className="text-sm text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisi vel hendrerit venenatis,
                  nunc nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc. Sed euismod, nunc nec tincidunt
                  tincidunt, nunc nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                />
                <span className="text-sm">I accept the terms and conditions</span>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
            </div>
          </div>
        )
      default:
        return null
    }
    
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your profile</h1>
          <p className="text-gray-400">Step {step} of 4</p>
        </div>

        {renderStep()}

        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <div className="space-x-2">
            {step < 4 && (
              <Button variant="ghost" onClick={() => setStep(step + 1)}>
                Skip
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={() => console.log("Form submitted")}>Finish</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
