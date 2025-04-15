import request from '~/utils/request';

export function createOrganizations(data) {
  return request({
    url: `/organizations`,
    method: 'post',
    data,
  });
}

export function retrieveOrganizations(params) {
  return request({
    url: `/organizations`,
    method: 'get',
    params,
  });
}

export function updateOrganizations({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}`,
    method: 'patch',
    data,
  });
}

export function patchVerificationOrganization({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/verification`,
    method: 'patch',
    data,
  });
}

export function getOrganizations(params) {
  return request({
    url: `/organizations/search`,
    method: 'get',
    params,
  });
}

export function retrieveOrganizationsProfile({ organizationId, ...params }) {
  return request({
    url: `/organizations/${organizationId}`,
    method: 'get',
    params,
  });
}
export function deleteOrganizations({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}`,
    method: 'delete',
    data,
  });
}
export function getOrgSocialLinks(organizationId) {
  return request({
    url: `/organizations/${organizationId}/social-links`,
    method: 'get',
  });
}
export function organizationInvitationsMembers({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/invite`,
    method: 'post',
    data,
  });
}
export function acceptOrganizationInvitations({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/accept-invitation`,
    method: 'patch',
    data,
  });
}
export function declineOrganizationInvitations({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/decline-invitation`,
    method: 'patch',
    data,
  });
}
export function organizationsMembers({ organizationId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/members/search`,
    method: 'get',
    params,
  });
}
export function invitationLink({ organizationId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/members/invitation-link`,
    method: 'get',
    params,
  });
}
export function deleteMembers({ organizationId, userId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/${userId}`,
    method: 'delete',
    data,
  });
}
export function deleteMembersInvitation({ organizationId, email, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/invitation/${email}`,
    method: 'delete',
    data,
  });
}
export function getInvitationMember({ organizationId, memberId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/members/invitation/${memberId}`,
    method: 'get',
    params,
  });
}
export function updateOrgMember({ organizationId, memberId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/${memberId}`,
    method: 'patch',
    data,
  });
}
export function organizationsGroups({ organizationId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/groups/search`,
    method: 'get',
    params,
  });
}
export function getOrgGroupDetail({ organizationId, groupId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}`,
    method: 'get',
    params,
  });
}

export function createOrgGroup({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/groups`,
    method: 'post',
    data,
  });
}

export function updateOrgGroup({ organizationId, groupId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}`,
    method: 'patch',
    data,
  });
}
export function deleteOrgGroup({ organizationId, groupId }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}`,
    method: 'delete',
  });
}

export function getOrgGroupMemberList({ organizationId, groupId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}/members/search`,
    method: 'get',
    params,
  });
}

export function createOrgGroupMember({ organizationId, groupId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}/members`,
    method: 'post',
    data,
  });
}
export function updateOrgGroupMemberRole({ organizationId, groupId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}/members`,
    method: 'patch',
    data,
  });
}

export function removeOrgGroupAllMember({ organizationId, groupId }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}/members/all`,
    method: 'delete',
  });
}
export function removeOrgGroupMember({ organizationId, groupId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/groups/${groupId}/members`,
    method: 'delete',
    data,
  });
}

export function getOrgMembersMap({ organizationId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/members/map`,
    method: 'get',
    params,
  });
}
export function getOrgMembersResources({ organizationId, userId, ...params }) {
  return request({
    url: `/organizations/${organizationId}/members/${userId}/resources`,
    method: 'get',
    params,
  });
}

export function patchOrgMembersResources({ organizationId, userId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/members/${userId}/resources`,
    method: 'patch',
    data,
  });
}

export function createOrSites({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/sites`,
    method: 'patch',
    data,
  });
}
export function removeOrSites({ organizationId, siteId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/sites/${siteId}`,
    method: 'patch',
    data,
  });
}

export function acceptBranchInvitation({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/branches/accept`,
    method: 'patch',
    data,
  });
}

export function declineBranchInvitation({ organizationId, ...data }) {
  return request({
    url: `/organizations/${organizationId}/branches/decline`,
    method: 'patch',
    data,
  });
}
