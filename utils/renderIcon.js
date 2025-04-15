export const renderIcon = (platform) => {
  if (platform === 'Instagram') {
    return '<i class="fa-brands fa-instagram" style="color:#b88b4a;"></i>';
  }
  if (platform === 'X') {
    return '<i class="fa-brands fa-x-twitter" style=""></i>';
  }
  if (platform === 'TikTok') {
    return '<i class="fa-brands fa-tiktok"></i>';
  }
  if (platform === 'Facebook') {
    return '<i class="fa-brands fa-facebook" style="color: #2c64f6;"></i>';
  }
  if (platform === 'Linkedin') {
    return '<i class="fa-brands fa-linkedin" style="color:#2d64bc;"></i>';
  }
  if (platform === 'Youtube') {
    return '<i class="fa-brands fa-youtube" style="color:#ea3323;"></i>';
  }
  if (platform === 'Behance') {
    return '<i class="fa-brands fa-behance" style="color:#2356f6;"></i>';
  }
  if (platform === 'Dribbble') {
    return '<i class="fa-solid fa-basketball" style="color:#e26f97;"></i>';
  }
  if (platform === 'Upwork') {
    return '<i class="fa-brands fa-upwork" style="color:#14a800;"></i>';
  }
  if (platform === 'Fiverr') {
    return '<img src="https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_clients_thumb/v1/attachments/company/logo/25bc0861a8579b6493c51a7e06c29420-1643199859/61a87d8f84d88e25cd784b0d.png" style="width: 14px; height: 14px;">';
  }
  if (platform === 'Custom') {
    return '<i class="fa-solid fa-link"></i>';
  }
};
