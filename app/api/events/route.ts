import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import Event from '@/database/event.model'

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const formData = await req.formData()
        console.log("FORM DATA:", [...formData.entries()])


        let event

        try {
            event = Object.fromEntries(formData.entries())
        } catch (e) {
            console.error(e)
            return NextResponse.json({ message: 'Invalid JSON Data format' }, { status: 400 })
        }

        const file = formData.get('image') as File

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 })

        // ✅ Explicitly extract slug
        const slug = formData.get("slug") as string;

        if (!slug || !slug.trim()) {
            return NextResponse.json(
                { message: "Slug is required" },
                { status: 400 }
            );
        }

        const parseList = (value: FormDataEntryValue | null) =>
            typeof value === 'string'
                ? value.split(',').map(v => v.trim()).filter(Boolean)
                : []

        const tags = parseList(formData.get('tags'))
        const agenda = parseList(formData.get('agenda'))


        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error)

                resolve(results)
            }).end(buffer)
        })

        event.image = (uploadResult as { secure_url: string }).secure_url

        const createdEvent = await Event.create({
            ...event,
            slug: slug,
            tags: tags,
            agenda: agenda,
        })

        return NextResponse.json({ message: 'Event created Successfully', event: createdEvent }, { status: 201 })

    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB()

        const events = await Event.find().sort({ createdAt: -1 })

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 })

    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 })
    }
}