"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function FirstMessages() {
  const [newUserMessage, setNewUserMessage] = useState(
    `Hello there! 💜 I'm Pryve, your AI companion. This is your safe space to share anything on your mind. I'm here to listen without judgment and support you through whatever you're experiencing. Whether you want to talk through your feelings, celebrate something wonderful, or just need someone to understand you - I'm here. What would you like to share with me today?`
  );

  const [returningUserMessage, setReturningUserMessage] = useState(
    `Welcome back, beautiful! 👋 I've missed our conversations. How are you feeling today?`
  );

  return (
    <Card className="rounded-2xl p-6 bg-white dark:bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <img src="/icons/Icon (6).svg" alt="First Messages" className="w-6 h-6" />
          <div>
            <CardTitle className="text-[18px] font-semibold">First Messages</CardTitle>
            <p className="text-[14px] text-muted-foreground mt-1">
              Initial greeting messages for different user types
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-[16px] font-semibold text-gray-900 mb-3">New User Message</h4>
            <div className="relative">
              <Textarea
                value={newUserMessage}
                onChange={(e) => setNewUserMessage(e.target.value)}
                className="min-h-[120px] resize-none pr-8 text-[14px] leading-relaxed bg-gray-50"
                placeholder="Enter new user greeting message..."
              />
              <div className="absolute top-2 right-2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 text-gray-400">
                <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[16px] font-semibold text-gray-900 mb-3">Returning User Message</h4>
            <div className="relative">
              <Textarea
                value={returningUserMessage}
                onChange={(e) => setReturningUserMessage(e.target.value)}
                className="min-h-[80px] resize-none pr-8 text-[14px] leading-relaxed bg-gray-50"
                placeholder="Enter returning user greeting message..."
              />
              <div className="absolute top-2 right-2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 text-gray-400">
                <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
