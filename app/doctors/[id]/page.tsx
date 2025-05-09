"use client";  // This marks the component as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Doctor = {
  user: {
    name: string;
    email: string;
  };
  specialty: string;
  bio: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
};

export default function DoctorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (id) {
        const res = await fetch(`/api/doctors/${id}`);
        const data = await res.json();
        setDoctor(data);
      }
    };
    fetchDoctorData();
  }, [id]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-profile">
      <h1>{doctor.user.name}</h1>
      <p>{doctor.specialty}</p>
      <p>{doctor.bio}</p>
      <p>Consultation Fee: ${doctor.consultationFee}</p>
      <p>Rating: {doctor.rating}</p>
      <p>Review Count: {doctor.reviewCount}</p>
    </div>
  );
}
