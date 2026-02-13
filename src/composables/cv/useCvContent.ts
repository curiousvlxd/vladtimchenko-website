import homeData from '~/data/content/home.json'
import cvData from '~/data/content/cv.json'
import { experienceEntries } from '~/data/experience'
import { educationEntries } from '~/data/education'
import { volunteeringEntries } from '~/data/volunteering'
import { CV_PAGE } from '~/constants/cv/cv'
import { SITE_NAME } from '~/constants/app/site'
import { requireSiteUrl } from '~/utils/site-url'
import { getSocialImageUrl } from '~/utils/social-image'

interface CvHomeContent {
  name?: string
  about?: {
    paragraphs?: string[]
  }
}

interface CvProfileContent {
  coreSkills?: string
}

export function useCvContent() {
  const home = homeData as CvHomeContent
  const cv = cvData as CvProfileContent

  const homeName = home.name ?? ''
  const profileText = home.about?.paragraphs?.[0] ?? ''
  const coreSkills = cv.coreSkills ?? ''

  const config = useRuntimeConfig()
  const siteUrl = requireSiteUrl(config.public.siteUrl)
  const cvUrl = `${siteUrl}${CV_PAGE.PATH}`
  const cvTitle = `${CV_PAGE.TITLE_PREFIX}${homeName || SITE_NAME}`
  const cvDescription = CV_PAGE.DESCRIPTION
  const imageUrl = getSocialImageUrl(config.public.siteUrl, {
    title: cvTitle,
    subtitle: cvDescription,
    section: 'CV'
  })

  useHead({
    title: cvTitle,
    link: [{ rel: 'canonical', href: cvUrl }],
    meta: [
      { name: 'description', content: cvDescription },
      { property: 'og:title', content: cvTitle },
      { property: 'og:description', content: cvDescription },
      { property: 'og:url', content: cvUrl },
      { property: 'og:image', content: imageUrl },
      { property: 'og:type', content: 'profile' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: cvTitle },
      { name: 'twitter:description', content: cvDescription },
      { name: 'twitter:image', content: imageUrl }
    ]
  })

  return {
    homeName,
    profileText,
    coreSkills,
    experienceEntries,
    educationEntries,
    volunteeringEntries
  }
}

