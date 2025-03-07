import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const MembershipPlans = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMembership, setUserMembership] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemberships();
    fetchUserMembership();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("status", "active")
        .order("price", { ascending: true });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast({
        title: "Error",
        description: "Failed to load membership plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMembership = async () => {
    try {
      // In a real app, this would use the current user's ID
      const userId = "current-user-id";
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*, memberships(*)")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("end_date", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setUserMembership(data[0]);
      }
    } catch (error) {
      console.error("Error fetching user membership:", error);
    }
  };

  const handleSubscribe = async (membershipId, price) => {
    try {
      // In a real app, this would integrate with a payment processor
      // and create a subscription
      toast({
        title: "Processing Payment",
        description: "Redirecting to payment gateway...",
      });

      // Simulate payment process
      setTimeout(() => {
        // After successful payment, create user membership
        createUserMembership(membershipId);
      }, 2000);
    } catch (error) {
      console.error("Error processing subscription:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive",
      });
    }
  };

  const createUserMembership = async (membershipId) => {
    try {
      // Find the membership to get duration
      const membership = memberships.find((m) => m.id === membershipId);
      if (!membership) throw new Error("Membership not found");

      // Calculate end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + membership.duration_days);

      // In a real app, this would use the current user's ID
      const userId = "current-user-id";

      // Create user membership record
      const { error } = await supabase.from("user_memberships").insert([
        {
          user_id: userId,
          membership_id: membershipId,
          end_date: endDate.toISOString(),
          status: "active",
        },
      ]);

      if (error) throw error;

      // Create payment record
      await supabase.from("payments").insert([
        {
          user_id: userId,
          amount: membership.price,
          currency: "USD",
          payment_method: "credit_card",
          status: "completed",
          reference_type: "membership",
          reference_id: membershipId,
          transaction_id: `demo-${Date.now()}`,
        },
      ]);

      toast({
        title: "Subscription Successful",
        description: `You are now subscribed to the ${membership.name} plan!`,
      });

      // Refresh user membership
      fetchUserMembership();
    } catch (error) {
      console.error("Error creating user membership:", error);
      toast({
        title: "Error",
        description: "Failed to activate subscription",
        variant: "destructive",
      });
    }
  };

  const renderFeature = (membership, featureKey, label) => {
    const features = membership.features || {};
    const value = features[featureKey];

    if (value === true) {
      return (
        <div className="flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <span>{label}</span>
        </div>
      );
    } else if (value === false) {
      return (
        <div className="flex items-center">
          <X className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-muted-foreground">{label}</span>
        </div>
      );
    } else if (typeof value === "number") {
      return (
        <div className="flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <span>
            {label}: {value === -1 ? "Unlimited" : value}
          </span>
        </div>
      );
    }

    return null;
  };

  const isCurrentPlan = (membershipId) => {
    return userMembership && userMembership.membership_id === membershipId;
  };

  if (loading) {
    return (
      <div className="w-full h-full p-6 bg-white rounded-lg shadow flex items-center justify-center">
        <p className="text-muted-foreground">Loading membership plans...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choose Your Membership Plan</h1>
        <p className="text-muted-foreground">
          Select the plan that best fits your language learning needs
        </p>
      </div>

      {userMembership && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Your Current Membership: {userMembership.memberships?.name}
          </h2>
          <p>
            Valid until:{" "}
            {new Date(userMembership.end_date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memberships.map((membership) => (
          <Card
            key={membership.id}
            className={`overflow-hidden ${isCurrentPlan(membership.id) ? "border-primary ring-2 ring-primary/20" : ""}`}
          >
            <div className="p-6 bg-slate-50">
              <h2 className="text-2xl font-bold mb-2">{membership.name}</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  ${membership.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground ml-2">
                  / {membership.duration_days === 365 ? "year" : "month"}
                </span>
              </div>
            </div>

            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                {membership.description}
              </p>

              <div className="space-y-3 mb-6">
                {renderFeature(
                  membership,
                  "course_access",
                  "Access to courses",
                )}
                {renderFeature(
                  membership,
                  "vocabulary_limit",
                  "Vocabulary items",
                )}
                {renderFeature(
                  membership,
                  "sentence_limit",
                  "Sentence collection",
                )}
                {renderFeature(
                  membership,
                  "listening_room",
                  "Listening room access",
                )}
                {renderFeature(
                  membership,
                  "practice_modules",
                  "Practice modules",
                )}
                {renderFeature(
                  membership,
                  "private_lessons_discount",
                  "Private lessons discount",
                )}
              </div>

              <Button
                className="w-full"
                variant={isCurrentPlan(membership.id) ? "outline" : "default"}
                disabled={isCurrentPlan(membership.id)}
                onClick={() => handleSubscribe(membership.id, membership.price)}
              >
                {isCurrentPlan(membership.id)
                  ? "Current Plan"
                  : membership.price === 0
                    ? "Get Started"
                    : "Subscribe"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;
