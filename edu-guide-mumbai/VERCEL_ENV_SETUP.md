# Vercel Environment Setup Guide

To make your Backend and Frontend work on Vercel, you must set the following **Environment Variables** in your Vercel Project Settings.

## 1. Database Setup (Crucial)
Vercel is serverless and cannot access your `localhost` MySQL. You must use a Cloud Database.

**GOOD NEWS:** I have already initialized your TiDB Cloud Database (`test`) with the required tables! You just need to connect Vercel to it.

## 2. Environment Variables to Set in Vercel
Go to **Settings > Environment Variables** in your Vercel Project and add these EXACT values:

### Required Variables
| Variable Name | Value |
|or|or|
| `DB_HOST` | `gateway01.eu-central-1.prod.aws.tidbcloud.com` |
| `DB_USER` | `2ST8jsi8rqo9KYA.root` |
| `DB_PASSWORD` | `nmPYTeOZXv4gkfP0` |
| `DB_NAME` | `test` |
| `DB_PORT` | `4000` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | `my-super-secret-key-123-edu-guide` |
| `NODE_ENV` | `production` |

### Optional / Feature Specific
| Variable Name | Value |
|or|or|
| `CLIENT_URL` | `https://frontend-edu-guide.vercel.app` |
| `GEMINI_API_KEY` | `AIzaSyB2DUFGTtbtqXsa1hW3Y-GrktWLsOmPbUk` |
| `VITE_API_URL` | `https://frontend-edu-guide.vercel.app/api` |

## 3. How to Add Them
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project (`edu-guide-mumbai` or `frontend`).
3. Click **Settings** (top menu).
4. Click **Environment Variables** (left menu).
5. Add each key-value pair from above.
6. **IMPORTANT:** After adding them, go to **Deployments** and click **Redeploy** on the latest commit for the changes to take effect.
