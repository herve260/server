import { z } from 'zod';
import { query, one } from '../config/db.js';
import { HttpError } from '../utils/http-error.js';
const makeSlug = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
const dest = z.object({
    name: z.string().min(2),
    slug: z.string().optional(),
    location: z.string().min(2),
    description: z.string().min(10),
    shortDescription: z.string().optional(),
    imageUrl: z.url().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    categoryId: z.coerce.number().nullable().optional(),
    featured: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
});
const intern = z.object({
    companyName: z.string().min(2),
    title: z.string().min(2),
    location: z.string().min(2),
    description: z.string().min(10),
    requirements: z.string().optional(),
    duration: z.string().optional(),
    deadline: z.coerce.date().optional(),
    contactEmail: z.email().optional(),
    registrationFee: z.coerce.number().min(0).optional(),
    paymentNote: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
});
export async function dashboard(_req, res) {
    const names = [
        'users',
        'destinations',
        'internships',
        'internship_applications',
        'training_registrations',
        'internship_payments',
        'feedback',
        'messages'
    ];
    const out = {};
    for (const n of names) {
        const r = await one(`SELECT COUNT(*) total FROM ${n}`);
        out[n === 'internship_applications'
            ? 'applications'
            : n === 'training_registrations'
                ? 'trainingRegistrations'
                : n === 'internship_payments'
                    ? 'payments'
                    : n] = Number(r?.total || 0);
    }
    res.json({
        success: true,
        data: out
    });
}
export async function listAdminDestinations(_req, res) {
    res.json({
        success: true,
        data: await query('SELECT * FROM destinations ORDER BY created_at DESC')
    });
}
export async function createDestination(req, res) {
    const d = dest.parse(req.body);
    const slug = d.slug || makeSlug(d.name);
    const r = await one(`INSERT INTO destinations
    (
      name,
      slug,
      location,
      description,
      short_description,
      image_url,
      latitude,
      longitude,
      category_id,
      featured,
      status
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [
        d.name,
        slug,
        d.location,
        d.description,
        d.shortDescription ?? null,
        d.imageUrl ?? null,
        d.latitude ?? null,
        d.longitude ?? null,
        d.categoryId ?? null,
        d.featured ?? false,
        d.status ?? 'DRAFT'
    ]);
    res.status(201).json({
        success: true,
        data: {
            id: r?.insertId,
            ...d,
            slug
        }
    });
}
export async function updateDestination(req, res) {
    const d = dest.partial().parse(req.body);
    const map = {
        name: 'name',
        slug: 'slug',
        location: 'location',
        description: 'description',
        shortDescription: 'short_description',
        imageUrl: 'image_url',
        latitude: 'latitude',
        longitude: 'longitude',
        categoryId: 'category_id',
        featured: 'featured',
        status: 'status'
    };
    const s = [];
    const p = [];
    for (const [k, v] of Object.entries(d)) {
        if (map[k]) {
            s.push(`${map[k]}=?`);
            p.push(v);
        }
    }
    if (s.length) {
        p.push(Number(req.params.id));
        await query(`UPDATE destinations SET ${s.join(',')} WHERE id=?`, p);
    }
    res.json({
        success: true
    });
}
export async function deleteDestination(req, res) {
    await query('DELETE FROM destinations WHERE id=?', [Number(req.params.id)]);
    res.json({
        success: true,
        message: 'Destination deleted'
    });
}
export async function listAdminInternships(_req, res) {
    const rows = await query(`SELECT i.*,
      (
        SELECT COUNT(*)
        FROM internship_applications a
        WHERE a.internship_id=i.id
      ) applications_count
    FROM internships i
    ORDER BY created_at DESC`);
    res.json({
        success: true,
        data: rows.map(x => ({
            ...x,
            companyName: x.company_name,
            registrationFee: Number(x.registration_fee || 0)
        }))
    });
}
export async function createInternship(req, res) {
    const d = intern.parse(req.body);
    const r = await one(`INSERT INTO internships
    (
      company_name,
      title,
      location,
      description,
      requirements,
      duration,
      deadline,
      contact_email,
      registration_fee,
      payment_note,
      status
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [
        d.companyName,
        d.title,
        d.location,
        d.description,
        d.requirements ?? null,
        d.duration ?? null,
        d.deadline ?? null,
        d.contactEmail ?? null,
        d.registrationFee ?? 0,
        d.paymentNote ?? null,
        d.status ?? 'DRAFT'
    ]);
    res.status(201).json({
        success: true,
        data: {
            id: r?.insertId,
            ...d
        }
    });
}
export async function updateInternship(req, res) {
    const d = intern.partial().parse(req.body);
    const map = {
        companyName: 'company_name',
        title: 'title',
        location: 'location',
        description: 'description',
        requirements: 'requirements',
        duration: 'duration',
        deadline: 'deadline',
        contactEmail: 'contact_email',
        registrationFee: 'registration_fee',
        paymentNote: 'payment_note',
        status: 'status'
    };
    const s = [];
    const p = [];
    for (const [k, v] of Object.entries(d)) {
        if (map[k]) {
            s.push(`${map[k]}=?`);
            p.push(v);
        }
    }
    if (s.length) {
        p.push(Number(req.params.id));
        await query(`UPDATE internships SET ${s.join(',')} WHERE id=?`, p);
    }
    res.json({
        success: true
    });
}
export async function deleteInternship(req, res) {
    await query('DELETE FROM internships WHERE id=?', [Number(req.params.id)]);
    res.json({
        success: true,
        message: 'Internship deleted'
    });
}
export async function listUsers(_req, res) {
    res.json({
        success: true,
        data: await query(`SELECT
        id,
        name,
        email,
        phone,
        role,
        language,
        status,
        created_at createdAt
      FROM users
      ORDER BY created_at DESC`)
    });
}
export async function updateUser(req, res) {
    const d = z.object({
        role: z.enum([
            'VISITOR',
            'STUDENT',
            'COMPANY',
            'ADMIN',
            'SUPER_ADMIN'
        ]).optional(),
        status: z.enum([
            'ACTIVE',
            'INACTIVE',
            'SUSPENDED'
        ]).optional()
    }).parse(req.body);
    if (d.status &&
        Number(req.params.id) === req.user.id &&
        d.status !== 'ACTIVE') {
        throw new HttpError(400, 'You cannot deactivate your own account');
    }
    const s = [];
    const p = [];
    for (const [k, v] of Object.entries(d)) {
        s.push(`${k}=?`);
        p.push(v);
    }
    p.push(Number(req.params.id));
    await query(`UPDATE users SET ${s.join(',')} WHERE id=?`, p);
    res.json({
        success: true
    });
}
export async function listPayments(_req, res) {
    res.json({
        success: true,
        data: await query(`SELECT
        p.*,
        i.title,
        u.name user_name,
        u.email user_email
      FROM internship_payments p
      JOIN internships i ON i.id=p.internship_id
      JOIN users u ON u.id=p.user_id
      ORDER BY p.created_at DESC`)
    });
}
export async function updatePayment(req, res) {
    const status = z.enum([
        'PENDING',
        'SUBMITTED',
        'VERIFIED',
        'REJECTED',
        'REFUNDED'
    ]).parse(req.body.status);
    await query(`UPDATE internship_payments
     SET status=?,
         paid_at=IF(?='VERIFIED',NOW(),paid_at)
     WHERE id=?`, [
        status,
        status,
        Number(req.params.id)
    ]);
    res.json({
        success: true
    });
}
export async function listFeedback(_req, res) {
    res.json({
        success: true,
        data: await query('SELECT * FROM feedback ORDER BY created_at DESC')
    });
}
export async function updateFeedback(req, res) {
    const status = z.enum([
        'PENDING',
        'APPROVED',
        'REJECTED'
    ]).parse(req.body.status);
    await query('UPDATE feedback SET status=? WHERE id=?', [
        status,
        Number(req.params.id)
    ]);
    res.json({
        success: true
    });
}
export async function listMessages(_req, res) {
    res.json({
        success: true,
        data: await query('SELECT * FROM messages ORDER BY created_at DESC')
    });
}
export async function uploadDestinationImage(req, res) {
    const destinationId = Number(req.params.id);
    if (!req.file) {
        throw new HttpError(400, 'Destination image is required');
    }
    const exists = await one('SELECT id FROM destinations WHERE id=?', [destinationId]);
    if (!exists) {
        throw new HttpError(404, 'Destination not found');
    }
    const imageUrl = `/uploads/destinations/${req.file.filename}`;
    const sort = await one(`SELECT
      COALESCE(MAX(sort_order), -1) + 1 AS nextOrder
     FROM destination_images
     WHERE destination_id=?`, [destinationId]);
    const result = await one(`INSERT INTO destination_images
    (
      destination_id,
      image_url,
      caption,
      sort_order
    )
    VALUES (?,?,?,?)`, [
        destinationId,
        imageUrl,
        String(req.body.caption || '').slice(0, 255) || null,
        Number(sort?.nextOrder || 0)
    ]);
    await query(`UPDATE destinations
     SET image_url=COALESCE(NULLIF(image_url,''),?)
     WHERE id=?`, [
        imageUrl,
        destinationId
    ]);
    res.status(201).json({
        success: true,
        data: {
            id: Number(result?.insertId),
            imageUrl
        }
    });
}
export async function listDestinationImages(req, res) {
    const rows = await query(`SELECT
      id,
      image_url imageUrl,
      caption,
      sort_order sortOrder
     FROM destination_images
     WHERE destination_id=?
     ORDER BY sort_order,id`, [Number(req.params.id)]);
    res.json({
        success: true,
        data: rows
    });
}
export async function deleteDestinationImage(req, res) {
    await query(`DELETE FROM destination_images
     WHERE id=? AND destination_id=?`, [
        Number(req.params.imageId),
        Number(req.params.id)
    ]);
    res.json({
        success: true
    });
}
//# sourceMappingURL=admin.controller.js.map