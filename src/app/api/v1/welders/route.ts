"use server";

import { NextRequest, NextResponse } from "next/server";
import { createWelder, updateWelder } from "@/server/services/welders";
import { Welder } from "@/app/types/welder";

// Example Request Body
// {
//   "is_active": true,
//   "first_name": "Test",
//   "middle_name": "Final",
//   "paternal_last_name": "Final",
//   "maternal_last_name": "Test",
//   "address": {
//     "street": "Caliza",
//     "number": "1201",
//     "city": "Monterrey",
//     "state": "Nuevo Leon",
//     "zip_code": "64989"
//   },
//   "phone": "8117858904",
//   "email": "jose.arturo99@outlook.com",
//   "secondary_email": "joseworld.zapto@hotmail.com",
//   "welder_id": "",
//   "groups": [
//     {
//       "id": "1",
//       "group_id": "1",
//       "name": "MX-021",
//       "date": "2001-07-21T05:00:00.000Z",
//       "created_at": "2025-07-18T20:46:23.000Z",
//       "updated_at": "2025-07-18T20:46:25.000Z"
//     }
//   ],
//   "certifications": [
//     {
//       "certification_id": "12098321",
//       "type": "AWS",
//       "certification_primitive": "1",
//       "level": "engineer",
//       "start_date": "2025-07-14",
//       "end_date": "2025-11-24",
//       "endorsements": [
//         {
//           "name": "9082348092"
//         },
//         {
//           "name": "8903489438943"
//         }
//       ]
//     },
//     {
//       "certification_id": "808028032",
//       "type": "CUSTOM",
//       "certification_primitive": "4",
//       "level": "CUSTOM",
//       "start_date": "2025-03-10",
//       "end_date": "2025-12-30",
//       "endorsements": []
//     }
//   ],
//   "endorsements": [
//     {
//       "id": "",
//       "name": "80923480932-ENG",
//       "created_at": "",
//       "updated_at": ""
//     },
//     {
//       "id": "",
//       "name": "89348943-CAWIENG",
//       "created_at": "",
//       "updated_at": ""
//     }
//   ]
// }

// NOTES:
// Endorsements array should also include the welder_id, this id is the id of the welder created by the DB, so we should await for the welder to be created first.
// For creating a welder, DO NOT SEND TIMESTAMPS (created_at, updated_at), DB should handle this, for the update just send the updated_at timestamp.
// For the endorsements in certifications we have a table called "endorsement" where we relate certification_id and the endorsement, so we should await for the certification to be created first, then add the endorsements to this table. The table schema is: certification_id, name
// For the welder groups we also have another table that relates a welder to a group, table name "welder-groups", table schema: welder_id, group_id
// Table name for certifications is "certification", the schema is the same as the request body received, so use the same column names, the "certification" table also expects a welder_id column!

export async function POST(request: NextRequest) {
  const welder: Partial<Welder> = await request.json();
  const { error, data } = await createWelder(welder);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const welder: Partial<Welder> = await request.json();
  const { error, data } = await updateWelder(welder);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
