import {
  contactChannels,
  projectCategories,
  projectMediaByProjectId,
  projects,
  studioProfile,
  teamMembers,
} from "@/data";

export function getStudioProfile() {
  return studioProfile;
}

export function getActiveProjects() {
  return projects
    .filter((project) => project.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProjects() {
  return getActiveProjects().filter((project) => project.isFeatured);
}

export function getProjectBySlug(slug: string) {
  return getActiveProjects().find((project) => project.slug === slug);
}

export function getProjectMediaByProjectId() {
  return projectMediaByProjectId;
}

export function getActiveProjectCategories() {
  return projectCategories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTeamMembers() {
  return teamMembers
    .filter((member) => member.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getContactChannels() {
  return contactChannels
    .filter((channel) => channel.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
