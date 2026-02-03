'use server'

import Event from "@/database/event.model"
import connectDB from "@/lib/mongodb"

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB()

        const event = await Event.findOne({ slug }).lean()
        if (!event) return []

        const events = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean()

        return events.map(e => ({
            ...e,
            _id: e._id.toString(),
            createdAt: e.createdAt?.toISOString(),
            updatedAt: e.updatedAt?.toISOString(),
        }))
    } catch {
        return []
    }
}
