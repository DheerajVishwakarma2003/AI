// ==============================
//   PostFlow AI — script.js
// ==============================

/* ---------- Captions Data ---------- */
const captions = {
  witty: {
    instagram: {
      text: "✨ Nature's glow! We're thrilled to introduce our new Organic Radiant Serum! 🌿 100% natural ingredients for that luminous skin you've been dreaming of. Who's ready to glow up? Shop link in bio!",
      hashtags: "#OrganicSkincare #NaturalGlow #RadiantSerum #SkinCareRoutine #BeautyTips"
    },
    linkedin: {
      text: "🌱 We're excited to announce the launch of our new Organic Radiant Serum — crafted with 100% natural ingredients designed to bring out your skin's inner glow. Because great skin shouldn't require a chemistry degree.",
      hashtags: "#OrganicSkincare #WellnessInnovation #BeautyTech #NaturalBeauty #ProductLaunch"
    }
  },
  professional: {
    instagram: {
      text: "Introducing our new Organic Radiant Serum — a breakthrough in natural skincare. 🌿 Formulated with premium botanical extracts, this serum delivers a luminous, healthy glow. Available now. Link in bio.",
      hashtags: "#OrganicSkincare #PremiumBeauty #RadiantSkin #CleanBeauty #SkinCareExpert"
    },
    linkedin: {
      text: "We are proud to unveil our latest innovation: the Organic Radiant Serum. Backed by rigorous research, this product blends the finest natural ingredients to deliver measurable results in skin luminosity and health.",
      hashtags: "#ProductLaunch #NaturalSkincare #BeautyIndustry #Innovation #CleanBeauty"
    }
  },
  inspiring: {
    instagram: {
      text: "Your skin tells your story. 🌸 Let it glow with our new Organic Radiant Serum — made from nature's finest ingredients to help you shine from within. You deserve to feel radiant every single day. ✨",
      hashtags: "#GlowFromWithin #OrganicBeauty #SkinCareLove #RadiantSkin #NaturalGlow"
    },
    linkedin: {
      text: "We believe beauty begins with nature. Our new Organic Radiant Serum is more than a product — it's a commitment to clean, powerful skincare that empowers you to show up as your most radiant self.",
      hashtags: "#CleanBeauty #Empowerment #NaturalSkincare #WellnessJourney #BeautyForAll"
    }
  },
  sarcastic: {
    instagram: {
      text: "Turns out glowing skin doesn't require 47 steps or a trust fund. 😏 Meet our Organic Radiant Serum — just nature doing what it does best. Revolutionary, we know. Grab it in bio before your pores notice.",
      hashtags: "#SkincareTruths #NaturalGlow #OrganicSerum #GlowUp #BeautyHumor"
    },
    linkedin: {
      text: "Groundbreaking take: skin loves natural ingredients. 🙃 After years of research and zero synthetic fillers, we've created the Organic Radiant Serum. Simple concept. Exceptional results. You're welcome.",
      hashtags: "#ProductLaunch #CleanBeauty #NaturalSkincare #Innovation #TakeThat"
    }
  }
};

const imagePool = [
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=600&q=80",
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80"
];

/* ---------- State ---------- */
let currentTone = "witty";
let activePlatforms = ["instagram", "linkedin"];
let currentImageIndex = 0;
let isGenerating = false;

/* ---------- Elements ---------- */
const generateBtn    = document.getElementById("generateBtn");
const igCaption      = document.getElementById("igCaption");
const postImage      = document.getElementById("postImage");
const imageLoading   = document.getElementById("imageLoading");
const likeBtn        = document.getElementById("likeBtn");
const editCaptionBtn = document.getElementById("editCaptionBtn");
const editModal      = document.getElementById("editModal");
const editCaptionText= document.getElementById("editCaptionText");
const cancelEdit     = document.getElementById("cancelEdit");
const saveCaption    = document.getElementById("saveCaption");
const downloadBtn    = document.getElementById("downloadBtn");
const toneButtons    = document.querySelectorAll(".tone-btn");
const platformTags   = document.querySelectorAll(".platform-tag");
const navItems       = document.querySelectorAll(".nav-item[data-page]");

/* ---------- Helpers ---------- */
function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function getPrimaryPlatform() {
  if (activePlatforms.includes("instagram")) return "instagram";
  if (activePlatforms.includes("linkedin")) return "linkedin";
  return "instagram";
}

function buildCaptionHTML(captionObj) {
  return `${captionObj.text}<span class="ig-hashtags">${captionObj.hashtags}</span>`;
}

function updatePreview() {
  const platform = getPrimaryPlatform();
  const data = captions[currentTone]?.[platform] || captions.witty.instagram;
  igCaption.innerHTML = buildCaptionHTML(data);
}

/* ---------- Tone Selection ---------- */
toneButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    toneButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTone = btn.dataset.tone;
  });
});

/* ---------- Platform Toggle ---------- */
platformTags.forEach(tag => {
  tag.addEventListener("click", () => {
    const p = tag.dataset.platform;
    if (activePlatforms.includes(p)) {
      if (activePlatforms.length > 1) {
        activePlatforms = activePlatforms.filter(x => x !== p);
        tag.classList.remove("active");
      }
    } else {
      activePlatforms.push(p);
      tag.classList.add("active");
    }
  });
});

/* ---------- Nav ---------- */
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove("active"));
    item.classList.add("active");
  });
});

/* ---------- Generate Post ---------- */
generateBtn.addEventListener("click", () => {
  if (isGenerating) return;
  isGenerating = true;
  generateBtn.classList.add("loading");
  generateBtn.disabled = true;

  // Simulate AI generation delay
  const delay = 1400 + Math.random() * 600;

  setTimeout(() => {
    updatePreview();

    // Cycle through image pool
    currentImageIndex = (currentImageIndex + 1) % imagePool.length;
    loadImage(imagePool[currentImageIndex]);

    generateBtn.classList.remove("loading");
    generateBtn.disabled = false;
    isGenerating = false;
    showToast("✨ Post generated!");
  }, delay);
});

function loadImage(src) {
  imageLoading.classList.add("active");
  postImage.style.opacity = "0";

  const img = new Image();
  img.onload = () => {
    postImage.src = src;
    postImage.style.opacity = "1";
    imageLoading.classList.remove("active");
  };
  img.onerror = () => {
    imageLoading.classList.remove("active");
    postImage.style.opacity = "1";
  };
  img.src = src;
}

/* ---------- Like Button ---------- */
likeBtn.addEventListener("click", () => {
  likeBtn.classList.toggle("liked");
  const isLiked = likeBtn.classList.contains("liked");
  if (isLiked) {
    likeBtn.style.transform = "scale(1.3)";
    setTimeout(() => { likeBtn.style.transform = ""; }, 250);
  }
});

/* ---------- Edit Caption ---------- */
editCaptionBtn.addEventListener("click", () => {
  const text = igCaption.textContent;
  editCaptionText.value = text.replace(/#[\w]+/g, '').trim();
  editModal.classList.add("active");
  editCaptionText.focus();
});

cancelEdit.addEventListener("click", () => {
  editModal.classList.remove("active");
});

editModal.addEventListener("click", (e) => {
  if (e.target === editModal) editModal.classList.remove("active");
});

saveCaption.addEventListener("click", () => {
  const newText = editCaptionText.value.trim();
  if (!newText) return;
  const platform = getPrimaryPlatform();
  const data = captions[currentTone]?.[platform] || captions.witty.instagram;
  igCaption.innerHTML = `${newText}<span class="ig-hashtags">${data.hashtags}</span>`;
  editModal.classList.remove("active");
  showToast("Caption saved!");
});

/* ---------- Regenerate Image ---------- */
document.getElementById("regenerateImageBtn").addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % imagePool.length;
  loadImage(imagePool[currentImageIndex]);
  showToast("Image regenerated!");
});

/* ---------- Download Button ---------- */
downloadBtn.addEventListener("click", () => {
  showToast("📥 Image download started!");
  // Trigger actual download via anchor
  const link = document.createElement("a");
  link.href = postImage.src;
  link.download = "postflow-image.jpg";
  link.target = "_blank";
  link.click();
});

/* ---------- Keyboard Shortcuts ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") editModal.classList.remove("active");
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generateBtn.click();
});

/* ---------- Initial Load ---------- */
updatePreview();