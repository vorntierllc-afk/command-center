'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, Legend,
} from 'recharts'

// ─── DATA ──────────────────────────────────────────────────────────────────

const TRANSACTIONS = [
  { id: 'ch_3FgH29kLmN4p', amount: 312.00, country: 'US', email: 'j.mitchell@gmail.com',       risk: 11, status: 'succeeded', flag: '🇺🇸', product: 'BPC-157 + TB-500 Stack',         date: 'Mar 17, 2:14 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_7Rt4XqBcP8wK', amount: 189.00, country: 'AU', email: 'r.harris@outlook.com',        risk: 18, status: 'succeeded', flag: '🇦🇺', product: 'Ipamorelin 5mg ×3',              date: 'Mar 17, 1:42 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_1Dm9VzNpR5sJ', amount: 540.00, country: 'RU', email: 'dmitri.v@mail.ru',            risk: 82, status: 'disputed',  flag: '🇷🇺', product: 'CJC-1295 + GHRP-6 10mg',       date: 'Mar 17, 3:08 AM',  disputeReason: 'Unauthorized transaction',  daysOpen: 2  },
  { id: 'ch_9Aw2MbCdF6yL', amount: 95.00,  country: 'US', email: 'kyle.b@gmail.com',            risk: 9,  status: 'succeeded', flag: '🇺🇸', product: 'Selank 5mg',                     date: 'Mar 16, 11:55 AM', disputeReason: null,                      daysOpen: null },
  { id: 'ch_5Kp8HqTnS3eW', amount: 720.00, country: 'NG', email: 'orders@tempmail.com',         risk: 94, status: 'disputed',  flag: '🇳🇬', product: 'Sermorelin 10mg ×5',             date: 'Mar 16, 4:17 AM',  disputeReason: 'Friendly fraud',            daysOpen: 3  },
  { id: 'ch_2Jx6EhUcQ9oI', amount: 268.00, country: 'CA', email: 'sarah.t@icloud.com',          risk: 13, status: 'succeeded', flag: '🇨🇦', product: 'Epithalon 10mg',                 date: 'Mar 16, 9:30 AM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_6Ys1LzWmA4rG', amount: 415.00, country: 'UA', email: 'buyer99@guerrillamail.com',   risk: 79, status: 'disputed',  flag: '🇺🇦', product: 'GHK-Cu 50mg',                   date: 'Mar 15, 2:50 AM',  disputeReason: 'Item not received',         daysOpen: 4  },
  { id: 'ch_8Fb3OiKvD7tE', amount: 149.00, country: 'GB', email: 'mark.w@hotmail.co.uk',        risk: 16, status: 'refunded',  flag: '🇬🇧', product: 'Hexarelin 2mg ×4',               date: 'Mar 15, 3:22 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_4Nc7PrGjB2uH', amount: 229.00, country: 'US', email: 'derek.s@gmail.com',           risk: 10, status: 'succeeded', flag: '🇺🇸', product: 'Thymosin Alpha-1 5mg',           date: 'Mar 15, 10:11 AM', disputeReason: null,                      daysOpen: null },
  { id: 'ch_0Qd5TaFkC8vM', amount: 378.00, country: 'DE', email: 'f.schmidt@web.de',            risk: 21, status: 'succeeded', flag: '🇩🇪', product: 'BPC-157 10mg ×2',               date: 'Mar 14, 4:48 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_3BmZ9UeNp1wX', amount: 865.00, country: 'NG', email: 'fastbuy@mailinator.com',      risk: 97, status: 'disputed',  flag: '🇳🇬', product: 'PT-141 10mg + CJC-1295',        date: 'Mar 14, 1:33 AM',  disputeReason: 'Friendly fraud',            daysOpen: 5  },
  { id: 'ch_7Vg4RcXsO6iF', amount: 134.00, country: 'US', email: 'alex.r@yahoo.com',            risk: 8,  status: 'succeeded', flag: '🇺🇸', product: 'DSIP 5mg',                       date: 'Mar 14, 2:05 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_2Lh8WnYtP3jD', amount: 490.00, country: 'BR', email: 'compras2@protonmail.com',     risk: 58, status: 'succeeded', flag: '🇧🇷', product: 'IGF-1 LR3 0.1mg ×10',           date: 'Mar 13, 7:14 AM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_5Ie1QbMuK7kC', amount: 215.00, country: 'NZ', email: 'j.tanner@gmail.com',          risk: 14, status: 'succeeded', flag: '🇳🇿', product: 'Semax 30mg',                     date: 'Mar 13, 12:38 PM', disputeReason: null,                      daysOpen: null },
  { id: 'ch_9Sf6HdAvJ4lB', amount: 675.00, country: 'RU', email: 'sergei.k@yandex.ru',          risk: 86, status: 'disputed',  flag: '🇷🇺', product: 'Fragment 176-191 + HGH Frag',   date: 'Mar 13, 3:51 AM',  disputeReason: 'Unauthorized transaction',  daysOpen: 6  },
  { id: 'ch_1Ug3CoZwL9mA', amount: 112.00, country: 'US', email: 'lisa.m@gmail.com',            risk: 7,  status: 'succeeded', flag: '🇺🇸', product: 'Oxytocin 2mg ×3',               date: 'Mar 12, 9:02 AM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_4Xp7DrEsM2nO', amount: 320.00, country: 'AU', email: 'tom.h@outlook.com.au',        risk: 17, status: 'succeeded', flag: '🇦🇺', product: 'TB-500 5mg ×4',                 date: 'Mar 12, 1:19 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_8Zk2FiRtN5pQ', amount: 580.00, country: 'MX', email: 'bulk@throwaway.email',        risk: 71, status: 'refunded',  flag: '🇲🇽', product: 'Melanotan II 10mg ×3',           date: 'Mar 12, 5:44 AM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_6Aw9GjSvB8qR', amount: 199.00, country: 'US', email: 'chris.p@icloud.com',          risk: 11, status: 'succeeded', flag: '🇺🇸', product: 'GHRP-2 5mg ×2',                 date: 'Mar 11, 3:30 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_3Tm5KbUxC1rS', amount: 445.00, country: 'IL', email: 'info@research-labs.co.il',    risk: 29, status: 'succeeded', flag: '🇮🇱', product: 'BPC-157 + KPV Stack',            date: 'Mar 11, 11:00 AM', disputeReason: null,                      daysOpen: null },
  { id: 'ch_7Nq8LcVyD4sT', amount: 258.00, country: 'US', email: 'brandon.k@gmail.com',         risk: 9,  status: 'succeeded', flag: '🇺🇸', product: 'Cerebrolysin 5ml',               date: 'Mar 10, 4:55 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_0Eo6MdWzE7tU', amount: 930.00, country: 'NG', email: 'order55@yopmail.com',         risk: 96, status: 'disputed',  flag: '🇳🇬', product: 'CJC-1295 DAC 5mg ×6',           date: 'Mar 10, 2:27 AM',  disputeReason: 'Friendly fraud',            daysOpen: 9  },
  { id: 'ch_5Ph1NeFaF2uV', amount: 175.00, country: 'CA', email: 'natalie.v@gmail.com',         risk: 12, status: 'succeeded', flag: '🇨🇦', product: 'AOD-9604 5mg',                   date: 'Mar 10, 10:40 AM', disputeReason: null,                      daysOpen: null },
  { id: 'ch_2Qi4OgGbG5vW', amount: 345.00, country: 'SE', email: 'e.lindqvist@gmail.com',       risk: 15, status: 'succeeded', flag: '🇸🇪', product: 'Ipamorelin + CJC-1295 Kit',      date: 'Mar 9, 2:18 PM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_9Rj7PhHcH8wX', amount: 780.00, country: 'UA', email: 'depot@trashmail.at',          risk: 91, status: 'disputed',  flag: '🇺🇦', product: 'TB-500 + BPC-157 Bulk 20mg',    date: 'Mar 9, 4:03 AM',   disputeReason: 'Unauthorized transaction',  daysOpen: 10 },
  { id: 'ch_4Sk0QiIdI1xY', amount: 88.00,  country: 'US', email: 'mike.c@gmail.com',            risk: 6,  status: 'succeeded', flag: '🇺🇸', product: 'KPV 50mg Peptide',               date: 'Mar 8, 9:45 AM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_6Tl1RjJeJ4yZ', amount: 420.00, country: 'DE', email: 'h.mueller@gmx.de',            risk: 19, status: 'succeeded', flag: '🇩🇪', product: 'Sermorelin 2mg ×6',              date: 'Mar 8, 3:12 PM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_8Um2SkKfK7zA', amount: 640.00, country: 'RU', email: 'anon_buy@mail.ru',            risk: 84, status: 'disputed',  flag: '🇷🇺', product: 'GHRP-6 + Ipamorelin Stack',     date: 'Mar 7, 2:22 AM',   disputeReason: 'Product not as described',  daysOpen: 12 },
  { id: 'ch_3Vn3TlLgL0aB', amount: 155.00, country: 'GB', email: 'andrew.f@gmail.com',          risk: 14, status: 'succeeded', flag: '🇬🇧', product: 'Selank + Semax Bundle',          date: 'Mar 7, 1:30 PM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_1Wo4UmMhM3bC', amount: 510.00, country: 'BR', email: 'vcbrasil@protonmail.com',     risk: 63, status: 'disputed',  flag: '🇧🇷', product: 'IGF-1 LR3 0.1mg ×12',           date: 'Mar 6, 6:50 AM',   disputeReason: 'Item not received',         daysOpen: 13 },
  { id: 'ch_5Xp5VnNiN6cD', amount: 279.00, country: 'US', email: 'jessica.l@yahoo.com',         risk: 10, status: 'succeeded', flag: '🇺🇸', product: 'Thymosin Beta-4 2mg ×4',         date: 'Mar 6, 11:00 AM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_7Yq6WoOjO9dE', amount: 1200.00,country: 'NG', email: 'bigorder@dispostable.com',    risk: 97, status: 'disputed',  flag: '🇳🇬', product: 'Mixed Peptide Bulk Pack ×20',    date: 'Mar 5, 1:05 AM',   disputeReason: 'Friendly fraud',            daysOpen: 14 },
  { id: 'ch_2Zr7XpPkP2eF', amount: 398.00, country: 'CA', email: 'wayne.b@rogers.com',          risk: 16, status: 'succeeded', flag: '🇨🇦', product: 'BPC-157 5mg ×5',                 date: 'Mar 5, 2:44 PM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_4As8YqQlQ5fG', amount: 225.00, country: 'AU', email: 'nick.p@bigpond.com',          risk: 20, status: 'succeeded', flag: '🇦🇺', product: 'Melanotan II 10mg',              date: 'Mar 4, 10:05 AM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_9Bt9ZrRmR8gH', amount: 475.00, country: 'UA', email: 'sale@fastmailua.com',         risk: 76, status: 'disputed',  flag: '🇺🇦', product: 'CJC-1295 2mg ×10',               date: 'Mar 4, 3:33 AM',   disputeReason: 'Credit not processed',      daysOpen: 15 },
  { id: 'ch_6Cu0AsSnS1hI', amount: 67.00,  country: 'US', email: 'emily.w@gmail.com',           risk: 5,  status: 'succeeded', flag: '🇺🇸', product: 'GHK-Cu 5mg Vial',               date: 'Mar 3, 1:55 PM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_3Dv1BtToT4iJ', amount: 560.00, country: 'MX', email: 'bulk2@dropmail.me',           risk: 68, status: 'refunded',  flag: '🇲🇽', product: 'Hexarelin 10mg ×4',              date: 'Mar 3, 5:10 AM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_1Ew2CuUpU7jK', amount: 289.00, country: 'IL', email: 'r.cohen@gmail.com',           risk: 22, status: 'succeeded', flag: '🇮🇱', product: 'Epithalon 10mg ×2',              date: 'Mar 2, 12:15 PM',  disputeReason: null,                      daysOpen: null },
  { id: 'ch_8Fx3DvVqV0kL', amount: 749.00, country: 'RU', email: 'ioffe2026@yandex.ru',         risk: 89, status: 'disputed',  flag: '🇷🇺', product: 'Cerebrolysin 5ml ×5',            date: 'Mar 2, 2:40 AM',   disputeReason: 'Unauthorized transaction',  daysOpen: 17 },
  { id: 'ch_5Gy4EwWrW3lM', amount: 139.00, country: 'NZ', email: 'p.mason@xtra.co.nz',          risk: 11, status: 'succeeded', flag: '🇳🇿', product: 'DSIP 5mg ×2',                    date: 'Mar 1, 3:30 PM',   disputeReason: null,                      daysOpen: null },
  { id: 'ch_2Hz5FxXsX6mN', amount: 880.00, country: 'NG', email: 'rush@guerrillamail.info',     risk: 95, status: 'disputed',  flag: '🇳🇬', product: 'AOD-9604 5mg ×10 + TB-500',     date: 'Mar 1, 4:58 AM',   disputeReason: 'Item not received',         daysOpen: 18 },
]

const CHART_DATA_12M = [
  { month: 'Jan \'25', rate: 0.24 },
  { month: 'Feb',      rate: 0.31 },
  { month: 'Mar',      rate: 0.38 },
  { month: 'Apr',      rate: 0.42 },
  { month: 'May',      rate: 0.57 },
  { month: 'Jun',      rate: 0.71 },
  { month: 'Jul',      rate: 0.79 },
  { month: 'Aug',      rate: 0.94 },
  { month: 'Sep',      rate: 1.08 },
  { month: 'Oct',      rate: 1.22 },
  { month: 'Nov',      rate: 1.38 },
  { month: 'Feb \'26', rate: 1.71 },
]

const MONTHLY_VOLUME = [
  { month: 'Oct',      volume: 41200 },
  { month: 'Nov',      volume: 53800 },
  { month: 'Dec',      volume: 68400 },
  { month: 'Jan',      volume: 71600 },
  { month: 'Feb',      volume: 54680 },
  { month: 'Mar',      volume: 94840 },
]

const RISK_DAILY = [
  { day: 'Mar 1',  avg: 48 }, { day: 'Mar 2',  avg: 62 }, { day: 'Mar 3',  avg: 44 },
  { day: 'Mar 4',  avg: 55 }, { day: 'Mar 5',  avg: 72 }, { day: 'Mar 6',  avg: 41 },
  { day: 'Mar 7',  avg: 53 }, { day: 'Mar 8',  avg: 18 }, { day: 'Mar 9',  avg: 67 },
  { day: 'Mar 10', avg: 58 }, { day: 'Mar 11', avg: 22 }, { day: 'Mar 12', avg: 46 },
  { day: 'Mar 13', avg: 61 }, { day: 'Mar 14', avg: 55 }, { day: 'Mar 15', avg: 36 },
  { day: 'Mar 16', avg: 60 }, { day: 'Mar 17', avg: 51 },
]

const RISK_DISTRIBUTION = [
  { bucket: '0-20',  count: 18 },
  { bucket: '21-40', count: 5  },
  { bucket: '41-60', count: 6  },
  { bucket: '61-80', count: 5  },
  { bucket: '81-100',count: 6  },
]

const RADAR_DATA = [
  { factor: 'Country', score: 12, fullMark: 25 },
  { factor: 'CB Rate', score: 4,  fullMark: 25 },
  { factor: 'Velocity', score: 8, fullMark: 20 },
  { factor: 'Email',   score: 6,  fullMark: 15 },
  { factor: 'Patterns',score: 4,  fullMark: 15 },
]

const RISK_FACTORS = [
  { label: 'High-risk country orders (NG, RU, UA)', pct: 41, color: '#DC2626' },
  { label: 'Disposable / throwaway email addresses', pct: 24, color: '#F97316' },
  { label: 'High-value single orders (>$500)',       pct: 18, color: '#EAB308' },
  { label: 'Off-hours transactions (1–5 AM)',         pct: 11, color: '#3B82F6' },
  { label: 'Repeat dispute customers',                pct: 6,  color: '#8B5CF6' },
]

const ACTIONS = [
  { priority: 'Urgent', text: 'Refund ch_3BmZ9UeNp1wX ($865 NG) and ch_0Eo6MdWzE7tU ($930 NG) before disputes escalate', color: 'bg-[#FEF2F2] text-[#DC2626]' },
  { priority: 'Urgent', text: 'Refund ch_9Rj7PhHcH8wX ($780 UA) — throwaway email, bulk order, 4 AM pattern',            color: 'bg-[#FEF2F2] text-[#DC2626]' },
  { priority: 'High',   text: 'Block card-not-present from NG, RU, UA for 30 days minimum',                              color: 'bg-[#FFF7ED] text-[#C2410C]' },
  { priority: 'High',   text: 'Require email verification for all orders over $400',                                     color: 'bg-[#FFF7ED] text-[#C2410C]' },
  { priority: 'Medium', text: 'Enable 3DS2 on all international card-not-present transactions',                          color: 'bg-[#FEFCE8] text-[#A16207]' },
  { priority: 'Medium', text: 'Set velocity rule: max 2 orders per email per 48 hours',                                  color: 'bg-[#FEFCE8] text-[#A16207]' },
]

type Alert = {
  id: number
  type: 'critical' | 'warning' | 'info'
  message: string
  time: string
  cause: string
  steps: string[]
  read: boolean
  resolved: boolean
}

const ALERTS_DATA: Alert[] = [
  { id: 1, type: 'critical', message: 'CB rate at 1.71% — above Visa\'s 1.0% early warning. 6 peptide orders from NG, RU, UA actively disputed.', time: '2h ago', read: false, resolved: false,
    cause: 'Six high-risk country orders (NG ×3, RU ×2, UA ×1) placed overnight using disposable emails pushed your monthly CB rate to 1.71%, crossing Visa\'s 1.0% early warning threshold.',
    steps: ['Refund ch_3BmZ9UeNp1wX ($865) and ch_0Eo6MdWzE7tU ($930) immediately to prevent formal chargebacks.', 'In Stripe, add a block rule for card-not-present transactions from NG, RU, UA.', 'Enable 3DS2 for all international orders above $200 in your Stripe Radar settings.'] },
  { id: 2, type: 'critical', message: 'ch_3BmZ9UeNp1wX ($865, NG): disposable email + 4 AM order + high-risk country. Refund immediately.', time: '3h ago', read: false, resolved: false,
    cause: 'Order placed at 1:33 AM with a Mailinator address from a Nigerian IP. This pattern matches 94% of previous fraudulent orders in this vertical.',
    steps: ['Issue full refund in Stripe (Payments → ch_3BmZ9UeNp1wX → Refund).', 'Block the card fingerprint via Stripe Radar to prevent future orders.', 'Flag the email domain mailinator.com in your blocklist.'] },
  { id: 3, type: 'critical', message: '3 disputes filed in last 48 hours totaling $2,135 — all international, all placed overnight (1–5 AM).', time: '5h ago', read: false, resolved: false,
    cause: 'Cluster of three dispute filings originating from RU, NG, and UA, all placed between 1–5 AM local time. Consistent BIN prefix on two cards suggests possible card testing.',
    steps: ['Review all overnight orders (1–5 AM) from the last 7 days and proactively refund high-risk ones.', 'Set a Stripe Radar rule to require 3DS for orders placed between 12 AM – 6 AM UTC.', 'Contact your acquiring bank to alert them of the spike before they flag your account.'] },
  { id: 4, type: 'warning', message: 'ch_9Rj7PhHcH8wX ($780, UA): guerrillamail address + bulk order at 4 AM. High probability of dispute within 7 days.', time: '8h ago', read: true, resolved: false,
    cause: 'Bulk TB-500 + BPC-157 order placed with a trashmail.at address at 4:03 AM. Similar pattern preceded 3 of the last 5 chargebacks.',
    steps: ['Proactively refund to avoid the dispute fee.', 'Add trashmail.at and similar domains to your Stripe Radar email blocklist.'] },
  { id: 5, type: 'warning', message: 'Velocity alert: 4 orders from Nigerian IPs in the last 72 hours. Block CNP transactions from NG recommended.', time: '12h ago', read: true, resolved: false,
    cause: 'Four separate card-not-present orders from Nigerian IP addresses in 72 hours, all with disposable emails, totaling $2,515.',
    steps: ['In Stripe Radar, add rule: block charge if ip_country = NG AND card_funding = credit.', 'Review the other two NG orders (ch_5Kp8HqTnS3eW, ch_2Hz5FxXsX6mN) and refund if not already shipped.'] },
  { id: 6, type: 'warning', message: 'ch_8Zk2FiRtN5pQ ($580, MX) refunded — throwaway email + 5 AM order. Pattern matches previous chargebacks.', time: '1d ago', read: true, resolved: false,
    cause: 'Melanotan II bulk order placed using throwaway.email at 5:44 AM from Mexico. Pre-emptive refund was correct but signals need for a permanent block rule.',
    steps: ['Add throwaway.email domain to Stripe Radar blocklist.', 'Set a velocity rule: max 1 order per IP per 24h for MX/BR.'] },
  { id: 7, type: 'info', message: 'Feb 2026 report: $284,520 total volume, 49 disputes, avg ticket $268. Top disputed product: CJC-1295 series.', time: '2d ago', read: true, resolved: false,
    cause: 'Monthly summary generated from 847 processed transactions.',
    steps: ['Review the full Feb report in the Disputes tab.', 'Consider restricting CJC-1295 bulk orders to verified customers only.'] },
  { id: 8, type: 'info', message: 'New Stripe sync completed. 847 transactions imported and scored across 32 countries.', time: '3d ago', read: true, resolved: false,
    cause: 'Periodic Stripe sync completed successfully.',
    steps: ['No action required.'] },
  { id: 9, type: 'warning', message: 'MID Health score dropped to 34/100 — acquiring bank review likely if CB rate exceeds 1.8%.', time: '4d ago', read: true, resolved: false,
    cause: 'Health score degraded due to elevated CB rate (1.71%), high-risk country concentration (41%), and email quality issues.',
    steps: ['Follow the action checklist in the MID Health tab.', 'Contact your acquiring bank proactively to demonstrate corrective action.'] },
  { id: 10, type: 'info', message: 'EDR coverage activated for Visa. Mastercard early dispute detection pending activation.', time: '5d ago', read: true, resolved: false,
    cause: 'Visa Rapid Dispute Resolution is live. Mastercard EDR requires separate enrollment.',
    steps: ['Activate Mastercard EDR via the Disputes tab to cover the remaining 35% of your dispute volume.'] },
]

const TABS = ['Overview', 'Transactions', 'Risk', 'Disputes', 'Alerts', 'MID Health']

type Tx = typeof TRANSACTIONS[number]
type ToastItem = { id: number; message: string }
type Message = { role: 'user' | 'assistant'; content: string }

// ─── HELPERS ───────────────────────────────────────────────────────────────

function riskColor(risk: number) {
  if (risk >= 80) return 'bg-[#FEF2F2] text-[#DC2626]'
  if (risk >= 50) return 'bg-[#FFF7ED] text-[#C2410C]'
  return 'bg-[#F0FDF4] text-[#15803D]'
}
function statusColor(status: string) {
  if (status === 'disputed') return 'bg-[#FEF2F2] text-[#DC2626]'
  if (status === 'refunded') return 'bg-[#EFF6FF] text-[#1D4ED8]'
  return 'bg-[#F0FDF4] text-[#15803D]'
}

// ─── TOAST ─────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="pointer-events-auto bg-[#0A0A0A] text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[240px]"
          >
            <span className="text-green-400 text-base">✓</span>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => onDismiss(t.id)} className="text-gray-400 hover:text-white text-xs">✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function DemoPage() {
  const [tab, setTab] = useState('Overview')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastCounter = useRef(0)

  const showToast = useCallback((message: string) => {
    const id = ++toastCounter.current
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Status bar */}
      <div className="bg-[#0A0A0A] text-white text-center py-2.5 px-4 text-sm flex items-center justify-center gap-3 flex-wrap">
        <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
        <span className="text-gray-200 font-medium">PureForm Peptides</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-400 text-xs">Research Peptides</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-400 text-xs">Last synced 4 min ago</span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="font-semibold text-[#0A0A0A] tracking-tight">HighRiskIntel</span>
            </div>
            <nav className="hidden md:flex gap-0.5 overflow-x-auto">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${tab === t ? 'bg-[#0A0A0A] text-white' : 'text-gray-500 hover:text-[#0A0A0A] hover:bg-gray-100'}`}>
                  {t}
                  {t === 'Alerts' && <span className="ml-1.5 bg-[#DC2626] text-white text-xs rounded-full px-1.5 py-0.5">3</span>}
                </button>
              ))}
            </nav>
          </div>
          <Link href="/signup" className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-800 transition">
            Get your dashboard →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {tab === 'Overview'      && <OverviewTab showToast={showToast} />}
        {tab === 'Transactions'  && <TransactionsTab showToast={showToast} />}
        {tab === 'Risk'          && <RiskTab showToast={showToast} />}
        {tab === 'Disputes'      && <DisputesTab showToast={showToast} />}
        {tab === 'Alerts'        && <AlertsTab showToast={showToast} />}
        {tab === 'MID Health'    && <MIDHealthTab showToast={showToast} />}

        {/* Footer CTA */}
        <div className="mt-16 bg-[#0A0A0A] rounded-2xl p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Want this for your store?</p>
          <p className="text-gray-400 text-sm mb-6">Connect your processor or upload statements — full AI risk analysis in under 2 minutes.</p>
          <Link href="/signup" className="inline-block bg-white text-[#0A0A0A] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition text-sm">
            Get started free →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── OVERVIEW TAB ──────────────────────────────────────────────────────────

function OverviewTab({ showToast }: { showToast: (m: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'PureForm\'s CB rate is **1.71%** — at current trajectory you hit Visa\'s 1.8% termination threshold in ~7 days. 6 active disputes total $3,325, 5 from NG/RU/UA.' },
    { role: 'user',      content: 'Which ones should I refund right now?' },
    { role: 'assistant', content: 'Refund ch_3BmZ9UeNp1wX ($865 NG) and ch_0Eo6MdWzE7tU ($930 NG) today — both are mailinator/yopmail addresses, 2 AM orders. That alone drops your projected rate to **1.08%** and buys 3+ weeks.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setTyping(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          conversation_history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      const reply = data.response || data.reply || 'I couldn\'t generate a response right now.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Unable to connect — please try again.' }])
    } finally {
      setTyping(false)
    }
  }

  function renderMsg(content: string) {
    return content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-500 text-sm">PureForm Peptides · March 2026</p>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Risk Overview</h1>
      </div>

      {/* Primary KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Chargeback Rate',  value: '1.71%',    sub: '↑ 0.33% from January', bad: true  },
          { label: 'Total Volume',     value: '$284,520', sub: 'Last 90 days',          bad: false },
          { label: 'Active Disputes',  value: '49',       sub: '12 unresolved',         bad: true  },
          { label: 'MID Health',       value: '34/100',   sub: 'Critical — act now',    bad: true  },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
            <p className="text-gray-500 text-xs font-medium mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.bad ? 'text-[#DC2626]' : 'text-[#0A0A0A]'}`}>{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg Ticket',       value: '$268'   },
          { label: 'Success Rate',     value: '94.2%'  },
          { label: 'High Risk Txns',   value: '8'      },
          { label: 'Monthly Volume',   value: '$94,840'},
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
            <p className="text-gray-400 text-xs mb-1">{k.label}</p>
            <p className="text-lg font-bold text-[#0A0A0A]">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0A0A0A]">Chargeback Rate — 12 Month Trend</h3>
              <p className="text-xs text-gray-400">Jan 2025 – Feb 2026</p>
            </div>
            <span className="text-xs bg-[#FEF2F2] text-[#DC2626] font-semibold px-2.5 py-1 rounded-full">Above threshold</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={CHART_DATA_12M}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 2.2]} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}%`, 'CB Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <ReferenceLine y={1.0} stroke="#F97316" strokeDasharray="4 4" label={{ value: 'Warning 1.0%', fontSize: 9, fill: '#F97316', position: 'insideTopRight' }} />
              <ReferenceLine y={1.8} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'Termination 1.8%', fontSize: 9, fill: '#DC2626', position: 'insideTopRight' }} />
              <Line type="monotone" dataKey="rate" stroke="#0A0A0A" strokeWidth={2.5} dot={{ r: 3, fill: '#0A0A0A' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="mb-4">
            <h3 className="font-semibold text-[#0A0A0A]">Monthly Volume</h3>
            <p className="text-xs text-gray-400">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_VOLUME}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Volume']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="volume" fill="#0A0A0A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Chat + Risk factors */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* AI Chat */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col overflow-hidden" style={{ minHeight: 380 }}>
          <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0A0A0A]">HRI Analyst</p>
              <p className="text-xs text-green-500">● Online</p>
            </div>
          </div>
          <div ref={chatRef} className="flex-1 p-4 space-y-3 text-xs overflow-y-auto" style={{ maxHeight: 300 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2.5 rounded-xl max-w-[85%] leading-relaxed ${m.role === 'user' ? 'bg-[#0A0A0A] text-white rounded-tr-sm' : 'bg-gray-50 text-gray-700 rounded-tl-sm'}`}
                  dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }} />
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-50 rounded-xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  {[0,1,2].map(i => (
                    <motion.span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full block"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#F3F4F6] flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about your risk profile..."
              className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0A0A0A] focus:ring-opacity-20" />
            <button onClick={sendMessage} disabled={!input.trim() || typing}
              className="bg-[#0A0A0A] text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-gray-800 transition disabled:opacity-40">
              Send
            </button>
          </div>
        </div>

        {/* Risk factors */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Risk Factor Breakdown</h3>
          <div className="space-y-3.5">
            {RISK_FACTORS.map(f => (
              <div key={f.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">{f.label}</span>
                  <span className="font-semibold text-[#0A0A0A]">{f.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
        <h3 className="font-semibold text-[#0A0A0A] mb-4">AI Recommended Actions</h3>
        <div className="space-y-3">
          {ACTIONS.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${a.color}`}>{a.priority}</span>
              <p className="text-xs text-gray-600 leading-relaxed">{a.text}</p>
              <button onClick={() => showToast('Action noted — added to queue')} className="ml-auto text-xs text-gray-400 hover:text-[#0A0A0A] flex-shrink-0 transition">Mark done</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TRANSACTIONS TAB ──────────────────────────────────────────────────────

function TransactionsTab({ showToast }: { showToast: (m: string) => void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(0)
  const [openRefund, setOpenRefund] = useState<string | null>(null)
  const [openReview, setOpenReview] = useState<string | null>(null)
  const PER_PAGE = 15

  const filtered = TRANSACTIONS.filter(tx => {
    const q = search.toLowerCase()
    const matchSearch = !q || tx.product.toLowerCase().includes(q) || tx.email.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q)
    const matchFilter =
      filter === 'All'      ? true :
      filter === 'Succeeded'? tx.status === 'succeeded' :
      filter === 'Disputed' ? tx.status === 'disputed' :
      filter === 'Refunded' ? tx.status === 'refunded' :
      filter === 'High Risk'? tx.risk >= 50 : true
    return matchSearch && matchFilter
  })

  const pages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const totalDisputed = filtered.filter(t => t.status === 'disputed').length
  const totalVolume = filtered.reduce((s, t) => s + t.amount, 0)

  const riskSignals = (tx: Tx) => {
    const signals = []
    if (['NG','RU','UA','BR','MX'].includes(tx.country)) signals.push({ label: `${tx.flag} High-risk country`, color: 'bg-[#FEF2F2] text-[#DC2626]' })
    if (tx.email.includes('mailinator') || tx.email.includes('guerrilla') || tx.email.includes('throwaway') || tx.email.includes('yopmail') || tx.email.includes('trashmail') || tx.email.includes('tempmail') || tx.email.includes('dispostable') || tx.email.includes('dropmail')) signals.push({ label: '📧 Disposable email', color: 'bg-[#FFF7ED] text-[#C2410C]' })
    if (tx.date.includes('AM') && (tx.date.includes(' 1:') || tx.date.includes(' 2:') || tx.date.includes(' 3:') || tx.date.includes(' 4:') || tx.date.includes(' 5:'))) signals.push({ label: '🌙 Off-hours order', color: 'bg-[#EEF2FF] text-[#4338CA]' })
    if (tx.amount > 500) signals.push({ label: '💰 High amount', color: 'bg-[#FEFCE8] text-[#A16207]' })
    return signals
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0A0A0A]">Transactions</h2>
          <p className="text-xs text-gray-400 mt-0.5">Mar 1–17, 2026</p>
        </div>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search by product, email, or order ID..."
          className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0A0A0A] focus:ring-opacity-20 w-full sm:w-72" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {['All', 'Succeeded', 'Disputed', 'Refunded', 'High Risk'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(0) }}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === f ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E5E7EB] text-gray-500 hover:border-[#0A0A0A] bg-white'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="bg-white rounded-xl px-4 py-2.5 border border-[#E5E7EB] flex flex-wrap gap-4 text-xs text-gray-500">
        <span><strong className="text-[#0A0A0A]">{filtered.length}</strong> transactions</span>
        <span><strong className="text-[#0A0A0A]">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> total</span>
        <span><strong className="text-[#DC2626]">{totalDisputed}</strong> disputed</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                {['Date', 'Order ID', 'Product', 'Amount', 'Country', 'Risk Score', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(tx => (
                <>
                  <tr key={tx.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition">
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{tx.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[160px] truncate">{tx.product}</td>
                    <td className="px-4 py-3 font-semibold text-[#0A0A0A] text-sm whitespace-nowrap">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{tx.flag} <span className="text-xs text-gray-500">{tx.country}</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskColor(tx.risk)}`}>{tx.risk}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(tx.status)}`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {tx.status === 'disputed' && (
                          <button onClick={() => setOpenRefund(openRefund === tx.id ? null : tx.id)}
                            className="text-xs bg-[#FEF2F2] text-[#DC2626] px-2.5 py-1 rounded-lg hover:bg-[#FEE2E2] transition font-medium">
                            Refund
                          </button>
                        )}
                        <button onClick={() => setOpenReview(openReview === tx.id ? null : tx.id)}
                          className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition font-medium">
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Refund confirmation panel */}
                  <AnimatePresence>
                    {openRefund === tx.id && (
                      <tr key={`refund-${tx.id}`}>
                        <td colSpan={8} className="px-0 py-0">
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-6 py-4 bg-[#FEF2F2] border-b border-[#FECACA] flex items-center gap-4">
                              <p className="text-sm text-[#DC2626] font-medium flex-1">Refund ${tx.amount.toFixed(2)} to {tx.email}?</p>
                              <button onClick={() => { showToast(`Refund of $${tx.amount.toFixed(2)} processed for ${tx.id}`); setOpenRefund(null) }}
                                className="bg-[#DC2626] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-[#B91C1C] transition font-semibold">
                                Confirm Refund
                              </button>
                              <button onClick={() => setOpenRefund(null)} className="text-xs text-gray-500 hover:text-gray-700 transition">Cancel</button>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                  {/* Review panel */}
                  <AnimatePresence>
                    {openReview === tx.id && (
                      <tr key={`review-${tx.id}`}>
                        <td colSpan={8} className="px-0 py-0">
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="text-xs font-semibold text-[#0A0A0A] mb-0.5">{tx.product}</p>
                                  <p className="text-xs text-gray-500">{tx.email} · {tx.country} · {tx.date}</p>
                                </div>
                                <button onClick={() => setOpenReview(null)} className="text-xs text-gray-400 hover:text-gray-700">✕</button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {riskSignals(tx).map((s, i) => (
                                  <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                                ))}
                                {riskSignals(tx).length === 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#15803D]">✓ No risk signals</span>}
                              </div>
                              <p className="text-xs text-gray-600">
                                <strong>Recommendation:</strong> {tx.risk >= 80 ? `Refund immediately — ${tx.risk}% dispute probability based on country + email pattern.` : tx.risk >= 50 ? `Monitor closely — ${tx.risk}% risk. Consider reaching out to customer.` : `Low risk. No action required.`}
                              </p>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-400">Page {page + 1} of {pages}</p>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
              Previous
            </button>
            <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── RISK TAB ──────────────────────────────────────────────────────────────

function RiskTab({ showToast }: { showToast: (m: string) => void }) {
  const [openAction, setOpenAction] = useState<string | null>(null)
  const highRisk = TRANSACTIONS.filter(t => t.risk >= 50)
  const critical = TRANSACTIONS.filter(t => t.risk >= 80)
  const high = TRANSACTIONS.filter(t => t.risk >= 50 && t.risk < 80)

  const riskSignals = (tx: Tx) => {
    const signals: { label: string; color: string }[] = []
    if (['NG','RU','UA','BR','MX'].includes(tx.country)) signals.push({ label: `${tx.flag} High-risk country`, color: 'bg-[#FEF2F2] text-[#DC2626]' })
    if (tx.email.includes('mailinator') || tx.email.includes('guerrilla') || tx.email.includes('throwaway') || tx.email.includes('yopmail') || tx.email.includes('trashmail') || tx.email.includes('tempmail') || tx.email.includes('dispostable') || tx.email.includes('dropmail')) signals.push({ label: '📧 Disposable email', color: 'bg-[#FFF7ED] text-[#C2410C]' })
    if (tx.date.includes('AM') && (tx.date.includes(' 1:') || tx.date.includes(' 2:') || tx.date.includes(' 3:') || tx.date.includes(' 4:') || tx.date.includes(' 5:'))) signals.push({ label: '🌙 Off-hours (early AM)', color: 'bg-[#EEF2FF] text-[#4338CA]' })
    if (tx.amount > 500) signals.push({ label: '💰 High amount', color: 'bg-[#FEFCE8] text-[#A16207]' })
    return signals
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#0A0A0A]">Risk Analysis</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical (≥80)',      value: String(critical.length), sub: 'Immediate action',   color: 'text-[#DC2626]' },
          { label: 'High (50–79)',         value: String(high.length),     sub: 'Review required',    color: 'text-[#F97316]' },
          { label: 'Countries Flagged',    value: '5',                     sub: 'NG, RU, UA, BR, MX', color: 'text-[#EAB308]' },
          { label: 'Disputed Revenue',     value: '$13,128',               sub: 'This period',        color: 'text-[#DC2626]' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
            <p className="text-gray-500 text-xs mb-1">{k.label}</p>
            <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={RISK_DISTRIBUTION}>
              <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {RISK_DISTRIBUTION.map((_, i) => (
                  <rect key={i} fill={i >= 3 ? '#DC2626' : i >= 2 ? '#F97316' : '#22C55E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Avg Risk Score — Last 17 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={RISK_DAILY}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Area type="monotone" dataKey="avg" stroke="#DC2626" strokeWidth={2} fill="url(#riskGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High-risk list */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
          <h3 className="font-semibold text-[#0A0A0A]">High-Risk Orders</h3>
          <span className="text-xs text-gray-400">{highRisk.length} transactions</span>
        </div>
        {highRisk.map(tx => (
          <div key={tx.id}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${riskColor(tx.risk)}`}>{tx.risk}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0A0A0A] truncate">{tx.product}</p>
                  <p className="text-xs text-gray-400 truncate">{tx.email} · {tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <p className="text-sm font-bold text-[#0A0A0A]">${tx.amount.toFixed(2)}</p>
                <span className="text-lg">{tx.flag}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(tx.status)}`}>{tx.status}</span>
                <button onClick={() => setOpenAction(openAction === tx.id ? null : tx.id)}
                  className="text-xs bg-[#0A0A0A] text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium flex-shrink-0">
                  Take Action
                </button>
              </div>
            </div>
            <AnimatePresence>
              {openAction === tx.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {riskSignals(tx).map((s, i) => (
                        <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 mb-4">
                      <strong>AI Recommendation:</strong> Refund immediately — {tx.risk}% probability of dispute based on country + email pattern. Acting now avoids a $35–$75 chargeback fee.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => { showToast(`Refund of $${tx.amount.toFixed(2)} processed for ${tx.id}`); setOpenAction(null) }}
                        className="text-xs bg-[#DC2626] text-white px-4 py-2 rounded-lg hover:bg-[#B91C1C] transition font-semibold">
                        Refund ${tx.amount.toFixed(2)}
                      </button>
                      <button onClick={() => { showToast(`Customer ${tx.email} blocked`); setOpenAction(null) }}
                        className="text-xs bg-[#0A0A0A] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-semibold">
                        Block Customer
                      </button>
                      <button onClick={() => setOpenAction(null)} className="text-xs text-gray-400 hover:text-gray-700 transition ml-2">Dismiss</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DISPUTES TAB ──────────────────────────────────────────────────────────

function DisputesTab({ showToast }: { showToast: (m: string) => void }) {
  const [openFight, setOpenFight] = useState<string | null>(null)
  const disputed = TRANSACTIONS.filter(t => t.status === 'disputed')
  const disputedRevenue = disputed.reduce((s, t) => s + t.amount, 0)

  function fightTemplate(tx: Tx) {
    return `On ${tx.date}, customer ${tx.email} placed order #${tx.id} for ${tx.product} ($${tx.amount.toFixed(2)}). The product was shipped to the address on file within 24 hours of order placement. Tracking confirms delivery on the expected date. We have attached proof of delivery and our terms of service, which the customer agreed to at checkout. The customer did not contact our support team prior to filing this dispute. We respectfully request this chargeback be reversed.`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#0A0A0A]">Disputes</h2>

      {/* EDR upsell */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1E1E2E] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-sm mb-1">Activate Early Dispute Detection</p>
          <p className="text-gray-300 text-xs leading-relaxed">Get alerted 24–72 hrs before disputes become chargebacks. Covers 95% of Visa + Mastercard. <strong className="text-white">$49/mo</strong></p>
        </div>
        <Link href="/signup" className="flex-shrink-0 bg-white text-[#0A0A0A] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-100 transition whitespace-nowrap">
          Activate →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Disputes',     value: '49',       color: 'text-[#DC2626]' },
          { label: 'Dispute Rate',       value: '1.71%',    color: 'text-[#DC2626]' },
          { label: 'Avg Dispute Amount', value: '$267',     color: 'text-[#0A0A0A]' },
          { label: 'Estimated Fees',     value: '$4,900',   color: 'text-[#DC2626]' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
            <p className="text-gray-500 text-xs mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
          <h3 className="font-semibold text-[#0A0A0A]">Disputed Transactions</h3>
          <span className="text-xs text-gray-400">${disputedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} at risk</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                {['Date', 'Product', 'Amount', 'Country', 'Dispute Reason', 'Days Open', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {disputed.map(tx => (
                <>
                  <tr key={tx.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition">
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[160px] truncate">{tx.product}</td>
                    <td className="px-4 py-3 font-semibold text-[#0A0A0A] text-sm whitespace-nowrap">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{tx.flag} <span className="text-xs text-gray-500">{tx.country}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{tx.disputeReason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${(tx.daysOpen || 0) > 20 ? 'text-[#DC2626]' : (tx.daysOpen || 0) > 10 ? 'text-[#F97316]' : 'text-gray-600'}`}>
                        {tx.daysOpen}d
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setOpenFight(openFight === tx.id ? null : tx.id)}
                          className="text-xs bg-[#EFF6FF] text-[#1D4ED8] px-2.5 py-1 rounded-lg hover:bg-[#DBEAFE] transition font-medium">
                          Fight
                        </button>
                        <button onClick={() => showToast(`Refund of $${tx.amount.toFixed(2)} initiated for ${tx.id}`)}
                          className="text-xs bg-[#FEF2F2] text-[#DC2626] px-2.5 py-1 rounded-lg hover:bg-[#FEE2E2] transition font-medium">
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {openFight === tx.id && (
                      <tr key={`fight-${tx.id}`}>
                        <td colSpan={7} className="px-0 py-0">
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-6 py-4 bg-[#EFF6FF] border-b border-[#BFDBFE]">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-[#1D4ED8]">AI-Generated Dispute Response</p>
                                <button onClick={() => setOpenFight(null)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-[#BFDBFE] mb-3">{fightTemplate(tx)}</p>
                              <button onClick={() => { showToast('Dispute response copied to clipboard'); navigator.clipboard?.writeText(fightTemplate(tx)) }}
                                className="text-xs bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition font-semibold">
                                Copy Response
                              </button>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── ALERTS TAB ────────────────────────────────────────────────────────────

function AlertsTab({ showToast }: { showToast: (m: string) => void }) {
  const [alertTab, setAlertTab] = useState<'All' | 'Unread' | 'Critical'>('All')
  const [openFix, setOpenFix] = useState<number | null>(null)
  const [alerts, setAlerts] = useState(ALERTS_DATA)

  const resolve = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
    showToast('Alert marked as resolved')
    setOpenFix(null)
  }

  const filtered = alerts.filter(a => {
    if (alertTab === 'Unread') return !a.read
    if (alertTab === 'Critical') return a.type === 'critical'
    return true
  })

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0A0A0A]">Alerts</h2>
        <span className="text-xs bg-[#FEF2F2] text-[#DC2626] font-semibold px-2.5 py-1 rounded-full">3 critical unread</span>
      </div>

      <div className="flex gap-1">
        {(['All', 'Unread', 'Critical'] as const).map(t => (
          <button key={t} onClick={() => setAlertTab(t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${alertTab === t ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E5E7EB] text-gray-500 hover:border-[#0A0A0A] bg-white'}`}>
            {t}{t === 'Unread' ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id}>
            <div className={`bg-white rounded-2xl border flex items-start gap-4 transition ${a.resolved ? 'opacity-50' : ''} ${
              a.type === 'critical' ? 'border-[#FECACA]' : a.type === 'warning' ? 'border-[#FED7AA]' : 'border-[#E5E7EB]'
            }`}>
              <div className="p-5 flex items-start gap-4 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                  a.type === 'critical' ? 'bg-[#FEF2F2]' : a.type === 'warning' ? 'bg-[#FFF7ED]' : 'bg-[#F9FAFB]'
                }`}>
                  {a.type === 'critical' ? '🚨' : a.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-[#0A0A0A] leading-relaxed ${a.resolved ? 'line-through text-gray-400' : ''}`}>{a.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                </div>
                {!a.resolved && (
                  <button onClick={() => setOpenFix(openFix === a.id ? null : a.id)}
                    className="flex-shrink-0 text-xs bg-[#0A0A0A] text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium">
                    Fix this
                  </button>
                )}
                {a.resolved && <span className="flex-shrink-0 text-xs text-green-600 font-medium">✓ Resolved</span>}
              </div>
            </div>
            <AnimatePresence>
              {openFix === a.id && !a.resolved && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mx-0 bg-[#F9FAFB] border border-t-0 border-[#E5E7EB] rounded-b-2xl px-6 py-4">
                    <p className="text-xs font-semibold text-[#0A0A0A] mb-2">What caused this</p>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{a.cause}</p>
                    <p className="text-xs font-semibold text-[#0A0A0A] mb-2">Resolution steps</p>
                    <ol className="space-y-2 mb-4">
                      {a.steps.map((s, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#0A0A0A] text-white text-center text-[10px] flex items-center justify-center mt-0.5">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                    <button onClick={() => resolve(a.id)}
                      className="text-xs bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                      Mark resolved
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MID HEALTH TAB ────────────────────────────────────────────────────────

function MIDHealthTab({ showToast }: { showToast: (m: string) => void }) {
  const [refundCount, setRefundCount] = useState(0)
  const [checklist, setChecklist] = useState([false, false, false, false, false])

  const baseRate = 1.71
  const projectedRate = Math.max(0.4, baseRate - refundCount * 0.12).toFixed(2)
  const projectedHealth = Math.min(100, 34 + refundCount * 4 + checklist.filter(Boolean).length * 4)

  const factors = [
    { label: 'Country Exposure',     score: 12, max: 25, color: '#DC2626' },
    { label: 'Chargeback Rate',      score: 4,  max: 25, color: '#DC2626' },
    { label: 'Transaction Velocity', score: 8,  max: 20, color: '#F97316' },
    { label: 'Email Quality',        score: 6,  max: 15, color: '#F97316' },
    { label: 'Order Patterns',       score: 4,  max: 15, color: '#DC2626' },
  ]

  const checklistItems = [
    'Block card-not-present from NG, RU, UA',
    'Enable 3DS2 for all international orders',
    'Require email verification for orders >$400',
    'Set velocity limit: 2 orders per email per 48h',
    'Activate Early Dispute Detection (EDR)',
  ]

  const toggle = (i: number) => {
    setChecklist(prev => { const n = [...prev]; n[i] = !n[i]; return n })
    showToast('Action checklist updated')
  }

  const score = 34
  const circumference = 2 * Math.PI * 54
  const offset = circumference * (1 - score / 100)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#0A0A0A]">MID Health</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Gauge */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center justify-center">
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={70} cy={70} r={54} fill="none" stroke="#F3F4F6" strokeWidth={12} />
            <circle cx={70} cy={70} r={54} fill="none" stroke="#DC2626" strokeWidth={12}
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 70 70)" />
            <text x={70} y={66} textAnchor="middle" className="text-3xl font-bold" fill="#DC2626" fontSize={28} fontWeight={700}>{score}</text>
            <text x={70} y={84} textAnchor="middle" fill="#9CA3AF" fontSize={11}>/100</text>
          </svg>
          <p className="text-sm font-bold text-[#DC2626] mt-1">Critical Risk</p>
          <p className="text-xs text-gray-400 mt-0.5 text-center">Estimated MID termination<br />in <strong className="text-[#DC2626]">23 days</strong> at current trajectory</p>
        </div>

        {/* Factor breakdown */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {factors.map(f => (
              <div key={f.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">{f.label}</span>
                  <span className="font-semibold" style={{ color: f.color }}>{f.score}/{f.max}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(f.score / f.max) * 100}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar + What-if simulator */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Health Factor Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Radar name="Score" dataKey="score" stroke="#DC2626" fill="#DC2626" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-2">What-If Simulator</h3>
          <p className="text-xs text-gray-500 mb-5">If I proactively refund X high-risk orders...</p>

          <label className="text-xs text-gray-600 font-medium">Refund {refundCount} high-risk orders</label>
          <input type="range" min={0} max={10} value={refundCount}
            onChange={e => setRefundCount(Number(e.target.value))}
            className="w-full mt-2 mb-5 accent-[#0A0A0A]" />

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F9FAFB] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Projected CB Rate</p>
              <p className={`text-xl font-bold ${Number(projectedRate) > 1.0 ? 'text-[#F97316]' : 'text-[#15803D]'}`}>{projectedRate}%</p>
              <p className="text-xs text-gray-400">was 1.71%</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Projected Health</p>
              <p className={`text-xl font-bold ${projectedHealth < 50 ? 'text-[#DC2626]' : projectedHealth < 70 ? 'text-[#F97316]' : 'text-[#15803D]'}`}>{projectedHealth}/100</p>
              <p className="text-xs text-gray-400">was 34/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thresholds + Checklist */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Visa / Mastercard Thresholds</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="text-left pb-2 text-gray-400 font-semibold">Level</th>
                <th className="text-left pb-2 text-gray-400 font-semibold">Visa</th>
                <th className="text-left pb-2 text-gray-400 font-semibold">Mastercard</th>
                <th className="text-left pb-2 text-gray-400 font-semibold">PureForm</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {[
                { level: 'Safe',         visa: '< 0.65%', mc: '< 1.0%',  pf: '—',     pfColor: 'text-gray-400' },
                { level: 'Early Warning',visa: '≥ 1.0%',  mc: '≥ 1.0%', pf: '1.71%', pfColor: 'text-[#DC2626] font-bold' },
                { level: 'Termination',  visa: '≥ 1.8%',  mc: '≥ 1.5%', pf: '→ 1.8%',pfColor: 'text-[#F97316]' },
              ].map(r => (
                <tr key={r.level} className="border-b border-[#F9FAFB]">
                  <td className="py-2.5 text-gray-700">{r.level}</td>
                  <td className="py-2.5 text-gray-600">{r.visa}</td>
                  <td className="py-2.5 text-gray-600">{r.mc}</td>
                  <td className={`py-2.5 ${r.pfColor}`}>{r.pf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Action Checklist</h3>
          <div className="space-y-3">
            {checklistItems.map((item, i) => (
              <label key={i} className={`flex items-start gap-3 cursor-pointer group`}>
                <input type="checkbox" checked={checklist[i]} onChange={() => toggle(i)} className="mt-0.5 accent-[#0A0A0A] w-4 h-4 flex-shrink-0" />
                <span className={`text-xs leading-relaxed ${checklist[i] ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-[#0A0A0A]'}`}>{item}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
            <p className="text-xs text-gray-500">{checklist.filter(Boolean).length}/5 completed · +{checklist.filter(Boolean).length * 4} health points</p>
          </div>
        </div>
      </div>
    </div>
  )
}
