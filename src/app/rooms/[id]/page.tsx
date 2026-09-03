import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hotelConfig } from "@/config/hotel.config";
import RoomDetailClient from "./RoomDetailClient";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

// Generate static routes for all rooms at build time
export async function generateStaticParams() {
  return hotelConfig.rooms.map((room) => ({
    id: room.id,
  }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { id } = await params;
  const room = hotelConfig.rooms.find((r) => r.id === id);

  if (!room) {
    return {
      title: `Suite Not Found | ${hotelConfig.brand.name}`,
    };
  }

  return {
    title: `${room.name} | ${hotelConfig.brand.name}`,
    description: room.shortDesc,
    openGraph: {
      title: `${room.name} — ${hotelConfig.brand.name}`,
      description: room.description,
      images: [{ url: room.image }],
    },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  const room = hotelConfig.rooms.find((r) => r.id === id);

  if (!room) {
    notFound();
  }

  return <RoomDetailClient room={room} />;
}
