import React, { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProfileTabCardProps {
  title: string
  description: string
  children: ReactNode
}

const ProfileTabCard = ({
  title,
  description,
  children,
}: ProfileTabCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default ProfileTabCard
