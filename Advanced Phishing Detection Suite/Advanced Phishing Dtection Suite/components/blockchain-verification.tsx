"use client"

import type { BlockchainVerification } from "@/types/phishing-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldAlert, CheckCircle, XCircle } from "lucide-react"

interface BlockchainVerificationProps {
  verification: BlockchainVerification
}

export function BlockchainVerificationCard({ verification }: BlockchainVerificationProps) {
  const { verified, timestamp, trustScore, network } = verification

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${verified ? "bg-success/10" : "bg-destructive/10"} pb-2`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {verified ? (
              <Shield className="h-5 w-5 text-success" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            )}
            Blockchain Verification
          </CardTitle>
          <Badge variant={verified ? "success" : "destructive"}>{verified ? "Verified" : "Unverified"}</Badge>
        </div>
        <CardDescription>
          {verified
            ? "This content has been verified on the blockchain"
            : "This content could not be verified on the blockchain"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Trust Score</span>
            <span className="font-medium">{(trustScore * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Network</span>
            <span className="font-medium">{network}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Timestamp</span>
            <span className="font-medium">{new Date(timestamp).toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            {verified ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span>
              {verified ? "Content integrity confirmed on the blockchain" : "Unable to verify content integrity"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

