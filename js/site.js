 <!-- JS Logic -->
 
        // --- Mobile Menu ---
        const menuBtn = document.getElementById('menu-btn');
        const closeMenuBtn = document.getElementById('close-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        function toggleMenu() {
           // mobileMenu.classList.toggle('menu-open');
			const isOpen = mobileMenu.classList.toggle('menu-open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        }
        menuBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);

        // --- Package Tabs & Cards ---
        function switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'text-lux-gold', 'border-b-2', 'border-lux-gold'));
            const activeBtn = document.getElementById('tab-' + tabName);
            activeBtn.classList.add('active', 'text-lux-gold', 'border-b-2', 'border-lux-gold');
            activeBtn.classList.remove('text-gray-600');

            ['ellos', 'ellas', 'mixto'].forEach(t => {
                document.getElementById('details-' + t).classList.add('hidden-view');
                document.getElementById('details-' + t).classList.remove('fade-enter-active');
            });
            const selectedView = document.getElementById('details-' + tabName);
            selectedView.classList.remove('hidden-view');
            void selectedView.offsetWidth; 
            selectedView.classList.add('fade-enter-active');
        }

        function toggleCard(card) {
            document.querySelectorAll('.card-reveal').forEach(c => {
                if(c !== card) c.classList.remove('active');
            });
            card.classList.toggle('active');
        }

        // --- Gallery & Lightbox Logic (AJUSTE 2) ---
        const galleryEllos = document.getElementById('accordion-ellos');
        const galleryEllas = document.getElementById('accordion-ellas');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
    
		let currentLightboxIndex = 0;
        let currentLightboxCategory = 'ellos'; // 'ellos' or 'ellas'
        const totalImages = { ellos: 23, ellas: 27 };

        function createAccordionItem(index, type) {
            const folder = type === 'ellos' ? 'h' : 'm';
            const catFolder = type === 'ellos' ? 'ellos' : 'ellas';
            const name = type === 'ellos' ? 'Elite' : 'Diosas';
            
            const div = document.createElement('div');
            div.className = 'accordion-item group relative';
            
			const alt = `${type === 'ellos' ? 'Stripper' : 'Bailarina'} profesional ${name} ${index} en CDMX`;

            // Add Click Event to Open Lightbox
            div.onclick = () => openLightbox(index, type);
			 const srcPng  = `img/${catFolder}/${folder}${index}.png`;
            const srcWebp = `img/${catFolder}/${folder}${index}.webp`; // si lo generas

					  div.innerHTML = `
			<img
			  data-src="${srcWebp}"
			  data-fallback="${srcPng}"
			  src="img/placeholder-1x1.png"
			  class="gallery-img absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
			  loading="lazy"
			  decoding="async"
			  alt="${type === 'ellos' ? 'Stripper' : 'Bailarina'} profesional ${name} ${index} en CDMX"
			>

			<div class="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
			  <span class="text-xl font-serif text-white/50 uppercase tracking-widest vertical-text" style="writing-mode: vertical-rl; text-orientation: mixed;">
				${name} ${index < 10 ? '0'+index : index}
			  </span>
			</div>

			<div class="content absolute bottom-0 left-0 w-full p-6 pointer-events-none">
			  <h3 class="text-3xl font-serif text-white italic mb-1">${name}</h3>
			  <p class="text-lux-gold text-[10px] tracking-widest uppercase font-bold mb-3">Model 00${index}</p>
			  <button class="px-4 py-2 border border-white text-white text-[9px] uppercase hover:bg-white hover:text-black transition-colors w-full">
				Ver Perfil
			  </button>
			</div>
		  `;

		  return div;
		}	

        // Populate Galleries
        for(let i=1; i<=23; i++) galleryEllos.appendChild(createAccordionItem(i, 'ellos'));
        for(let i=1; i<=27; i++) galleryEllas.appendChild(createAccordionItem(i, 'ellas'));

				// True lazy-load (solo carga cuando entra al viewport)
		const io = new IntersectionObserver((entries, obs) => {
		  entries.forEach(entry => {
			if (!entry.isIntersecting) return;

			const img = entry.target;
			const src = img.dataset.src;
			const fallback = img.dataset.fallback;

			// intenta WebP primero
			img.src = src;

			img.onerror = () => {
			  img.onerror = null;
			  img.src = fallback; // cae a PNG
			};

			obs.unobserve(img);
		  });
		}, {
		  root: null,
		  rootMargin: "300px 0px", // precarga un poquito antes de que se vea
		  threshold: 0.01
		});

		document.querySelectorAll('.gallery-img').forEach(img => io.observe(img));
				
		// Lightbox Functions
        function openLightbox(index, category) {
            currentLightboxIndex = index;
            currentLightboxCategory = category;
            updateLightbox();
            lightbox.classList.remove('hidden');
            setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        function closeLightbox() {
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = ''; 
            }, 300);
        }
		
		// ✅ Cerrar lightbox con ESC
		document.addEventListener('keydown', (e) => {
		  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
			closeLightbox();
		  }
		});
		

        function updateLightbox() {
			  const folder = currentLightboxCategory === 'ellos' ? 'h' : 'm';
			  const catFolder = currentLightboxCategory === 'ellos' ? 'ellos' : 'ellas';
			  const name = currentLightboxCategory === 'ellos' ? 'Elite' : 'Goddess';

			  const webp = `img/${catFolder}/${folder}${currentLightboxIndex}.webp`;
			  const png  = `img/${catFolder}/${folder}${currentLightboxIndex}.png`;

			  lightboxImg.src = webp;
			  lightboxImg.onerror = () => {
				lightboxImg.onerror = null;
				lightboxImg.src = png;
			  };

			  lightboxCaption.textContent =
				`${name} ${currentLightboxIndex < 10 ? '0'+currentLightboxIndex : currentLightboxIndex}`;
			}


        function nextImage() {
            currentLightboxIndex++;
            if (currentLightboxIndex > totalImages[currentLightboxCategory]) currentLightboxIndex = 1;
            updateLightbox();
        }

        function prevImage() {
            currentLightboxIndex--;
            if (currentLightboxIndex < 1) currentLightboxIndex = totalImages[currentLightboxCategory];
            updateLightbox();
        }

        // Swipe Detection for Mobile
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        lightbox.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextImage(); // Swipe Left -> Next
            if (touchEndX > touchStartX + 50) prevImage(); // Swipe Right -> Prev
        }, {passive: true});


        // --- Video Switcher ---
        // --- Video Playlist (20) ---
		const videoPlaylist = [
		  { title: "Show 1",          cat:"VIP",  src: "video/video1.mp4",  poster: "video/v1.webp"  },
		  { title: "Show 2",       cat:"VIP",  src: "video/video2.mp4",  poster: "video/v2.webp"  },
		  { title: "Show 3",    cat:"VIP",  src: "video/video3.mp4",  poster: "video/v3.webp"  },
		  { title: "Show 4",           cat:"VIP",  src: "video/video4.mp4",  poster: "video/v4.webp"  },
		  { title: "Show 5",      cat:"VIP",  src: "video/video5.mp4",  poster: "video/v5.webp"  },
		  { title: "Show 6",         cat:"VIP",  src: "video/video6.mp4",  poster: "video/v6.webp"  },
		  { title: "Show 7",  cat:"VIP",  src: "video/video7.mp4",  poster: "video/v7.webp"  },
		  { title: "Show 8",            cat:"VIP",  src: "video/video8.mp4",  poster: "video/v8.webp"  },
		  { title: "Show 9",           cat:"VIP",  src: "video/video9.mp4",  poster: "video/v9.webp"  },
		  { title: "Show 10",             cat:"VIP",  src: "video/video10.mp4", poster: "video/v10.webp" },

		  { title: "Fiesta 1",      cat:"FIESTA", src: "video/video11.mp4", poster: "video/v11.webp" },
		  { title: "Fiesta 2",            cat:"FIESTA", src: "video/video12.mp4", poster: "video/v12.webp" },
		  { title: "Fiesta 3",               cat:"FIESTA", src: "video/video13.mp4", poster: "video/v13.webp" },
		  { title: "Fiesta 4",           cat:"FIESTA", src: "video/video14.mp4", poster: "video/v14.webp" },
		  { title: "Fiesta 5",          cat:"FIESTA", src: "video/video15.mp4", poster: "video/v15.webp" },
		  { title: "Fiesta 6",          cat:"FIESTA", src: "video/video16.mp4", poster: "video/v16.webp" },
		  { title: "Fiesta 7",          cat:"FIESTA", src: "video/video17.mp4", poster: "video/v17.webp" },
		  { title: "Fiesta 8",              cat:"FIESTA", src: "video/video18.mp4", poster: "video/v18.webp" },
		  { title: "Fiesta 9",             cat:"FIESTA", src: "video/video19.mp4", poster: "video/v19.webp" },
		  { title: "Fiesta 10",               cat:"FIESTA", src: "video/video20.mp4", poster: "video/v20.webp" }
		];

		
		const videoEl = document.getElementById("cinema-video");
		const sourceEl = document.getElementById("video-source");
		const titleEl = document.getElementById("video-title");
		const playBtn = document.getElementById("cinema-play-btn");

		let activeIndex = 0;

		const vipEl    = document.getElementById("playlist-vip");
		const fiestaEl = document.getElementById("playlist-fiesta");

		function cardTemplate(v, idx) {
		  return `
			<button
			  type="button"
			  class="vid-item snap-start shrink-0 w-[72vw] sm:w-[44vw] lg:w-[260px]
					 group border border-white/10 bg-black/30 hover:border-lux-gold transition-all text-left p-2"
			  data-index="${idx}"
			  aria-label="Reproducir: ${v.title}"
			>
			  <div class="relative aspect-video overflow-hidden border border-white/10">
				<img
				  src="${v.poster}"
				  alt="Video: ${v.title}"
				  loading="lazy"
				  onerror="this.src='video/poster-default.jpg'"
				  class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
			  </div>
			  <div class="mt-2">
				<p class="text-[10px] uppercase tracking-widest text-white/70 group-hover:text-lux-gold transition-colors line-clamp-2">
				  ${v.title}
				</p>
			  </div>
			</button>
		  `;
		}

		function renderRow(cat, el) {
		  el.innerHTML = videoPlaylist
			.map((v, idx) => ({ v, idx }))
			.filter(x => x.v.cat === cat)
			.map(x => cardTemplate(x.v, x.idx))
			.join("");
		}

		function renderAllPlaylists() {
		  renderRow("VIP", vipEl);
		  renderRow("FIESTA", fiestaEl);
		  setActiveUI(0);
		}



		function setActiveUI(i) {
			  activeIndex = i;
			  document.querySelectorAll(".vid-item").forEach((btn) => {
				const idx = Number(btn.dataset.index);
				const isActive = idx === i;
				btn.classList.toggle("border-lux-gold", isActive);
				btn.classList.toggle("shadow-glow-gold", isActive);
			  });
			}
			
			document.addEventListener("click", (e) => {
			  const btn = e.target.closest(".vid-item[data-index]");
			  if (!btn) return;
			  loadVideo(Number(btn.dataset.index), true);
			});
			
			function scrollCarousel(el, dir) {
				  el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
				}

				document.querySelectorAll("button[data-scroll]").forEach((b) => {
				  const el = document.getElementById(b.dataset.scroll);
				  const dir = Number(b.dataset.dir);
				  b.addEventListener("click", () => scrollCarousel(el, dir));
				});


		function loadVideo(i, autoplay = false) {
		  const v = videoPlaylist[i];
		  setActiveUI(i);

		  // Reset player UI
		  playBtn.style.display = "flex";
		  videoEl.pause();
		  videoEl.currentTime = 0;
		  videoEl.removeAttribute("controls");
		  videoEl.style.opacity = "0.6";

		  // Load selected
		  titleEl.textContent = v.title;
		  videoEl.setAttribute("poster", v.poster || "/img/video/poster-default.jpg");
		  sourceEl.src = v.src;
		  videoEl.load();

		  if (autoplay) playCinema();
		  track("video_select", { index: i, title: v.title, category: v.cat });

		}

		function playCinema() {
		  track("video_play", { title: titleEl.textContent });
		  if (!sourceEl.src) return; // por si alguien da play sin seleccionar
		  if (videoEl.paused) {
			videoEl.play();
			videoEl.setAttribute("controls", "controls");
			videoEl.style.opacity = "1";
			playBtn.style.display = "none";
		  }
		}

		

		// UX: pausa con ESC
		document.addEventListener("keydown", (e) => {
		  if (e.key === "Escape" && !videoEl.paused) {
			videoEl.pause();
			playBtn.style.display = "flex";
			videoEl.style.opacity = "0.6";
		  }
		});

		// Init
		renderAllPlaylists();
		loadVideo(0, false);


        // --- Scroll Up & Bubble ---
        const scrollUpBtn = document.getElementById('scroll-up');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollUpBtn.classList.remove('hidden');
                scrollUpBtn.classList.add('flex');
            } else {
                scrollUpBtn.classList.add('hidden');
                scrollUpBtn.classList.remove('flex');
            }
        });
        scrollUpBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const bubble = document.getElementById('wa-bubble');
        setInterval(() => {
            bubble.classList.remove('opacity-0');
            setTimeout(() => bubble.classList.add('opacity-0'), 4000);
        }, 10000);
        setTimeout(() => bubble.classList.remove('opacity-0'), 2000);
        setTimeout(() => bubble.classList.add('opacity-0'), 6000);
		
		
		function track(name, params = {}) {
			  if (typeof gtag === "function") gtag("event", name, params);
			}

			// WhatsApp clicks
			document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
			  a.addEventListener("click", () => {
				track("whatsapp_click", {
				  link_text: (a.textContent || "").trim().slice(0, 40),
				  href: a.getAttribute("href")
				});
			  });
			});

			// Tel clicks
			document.querySelectorAll('a[href^="tel:"]').forEach(a => {
			  a.addEventListener("click", () => {
				track("call_click", { href: a.getAttribute("href") });
			  });
			});

			// Reservar (botones/links con texto “Reservar” o “Contactar Ahora”)
			document.querySelectorAll("a,button").forEach(el => {
			  const t = (el.textContent || "").toLowerCase();
			  if (t.includes("reservar") || t.includes("contactar ahora")) {
				el.addEventListener("click", () => track("cta_click", { label: t.slice(0, 40) }));
			  }
			});

