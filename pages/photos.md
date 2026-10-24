---
layout: default
permalink: /photos/
---

<div class="photos-backdoor">
	<h2>Tour Photos Archive</h2>
	<div id="shows-search" style="margin: 14px 0 18px 0;">
		<input
			type="text"
			id="photos-search-input"
			placeholder="Filter by city, date, or tour (e.g. Tokyo, 2008, Sausagefest, Polaroids)..."
			autocomplete="off"
			style="width: 100%; padding: 7px 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; background-color: #faf9f6;"
		/>
	</div>
	<div id="photos-tour-filters" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;"></div>
	<div id="photos-archive-container"></div>
</div>

<div id="photo-lightbox" class="photo-lightbox" onclick="closePhotoLightbox(event)">
	<button class="lightbox-close" onclick="closePhotoLightbox(event)" aria-label="Close">&times;</button>
	<button class="lightbox-nav lightbox-prev" onclick="stepPhotoLightbox(event, -1)" aria-label="Previous">&#8249;</button>
	<div class="lightbox-inner">
		<img id="lightbox-img" src="" alt="" />
		<div id="lightbox-caption" class="lightbox-caption"></div>
	</div>
	<button class="lightbox-nav lightbox-next" onclick="stepPhotoLightbox(event, 1)" aria-label="Next">&#8250;</button>
</div>

<script>
	var currentLightboxGroup = [];
	var currentLightboxIdx = 0;

	function openPhotoLightbox(imgEl) {
		var container = document.getElementById("photos-archive-container");
		currentLightboxGroup = Array.from(
			container.querySelectorAll(".tour-day-block:not([style*='display: none']) img")
		);
		currentLightboxIdx = currentLightboxGroup.indexOf(imgEl);
		if (currentLightboxIdx === -1) {
			currentLightboxGroup = [imgEl];
			currentLightboxIdx = 0;
		}
		updatePhotoLightbox();
		document.getElementById("photo-lightbox").classList.add("open");
	}

	function updatePhotoLightbox() {
		var target = currentLightboxGroup[currentLightboxIdx];
		if (!target) return;
		document.getElementById("lightbox-img").src = target.src;
		document.getElementById("lightbox-caption").textContent =
			target.getAttribute("data-caption") || target.alt || "";
	}

	function stepPhotoLightbox(e, dir) {
		e.stopPropagation();
		if (!currentLightboxGroup.length) return;
		currentLightboxIdx =
			(currentLightboxIdx + dir + currentLightboxGroup.length) %
			currentLightboxGroup.length;
		updatePhotoLightbox();
	}

	function closePhotoLightbox(e) {
		if (
			e.target.id === "photo-lightbox" ||
			e.target.classList.contains("lightbox-close")
		) {
			document.getElementById("photo-lightbox").classList.remove("open");
		}
	}

	document.addEventListener("keydown", function (e) {
		var lb = document.getElementById("photo-lightbox");
		if (!lb || !lb.classList.contains("open")) return;
		if (e.key === "Escape") lb.classList.remove("open");
		if (e.key === "ArrowLeft") stepPhotoLightbox(e, -1);
		if (e.key === "ArrowRight") stepPhotoLightbox(e, 1);
	});

	function escapeHtml(str) {
		return String(str || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	document.addEventListener("DOMContentLoaded", function () {
		fetch("/assets/data/archive_pool.json")
			.then(function (r) {
				return r.json();
			})
			.then(function (pool) {
				var photoDays = pool.filter(function (item) {
					return item.type === "tour-photos";
				});

				var container = document.getElementById("photos-archive-container");
				var filtersEl = document.getElementById("photos-tour-filters");
				var archives = [];
				photoDays.forEach(function (d) {
					if (archives.indexOf(d.archive) === -1) archives.push(d.archive);
				});

				var activeArchive = "ALL";

				function renderFilters() {
					var allBtn =
						'<button type="button" data-archive="ALL" style="background:' +
						(activeArchive === "ALL" ? "#aa2125" : "#828282") +
						'; font-size:12px;">All Tours (' +
						photoDays.length +
						" days)</button>";
					var btns = archives
						.map(function (a) {
							var bg = activeArchive === a ? "#aa2125" : "#828282";
							return (
								'<button type="button" data-archive="' +
								escapeHtml(a) +
								'" style="background:' +
								bg +
								'; font-size:12px;">' +
								escapeHtml(a) +
								"</button>"
							);
						})
						.join("");
					filtersEl.innerHTML = allBtn + btns;
					Array.from(filtersEl.querySelectorAll("button")).forEach(function (b) {
						b.addEventListener("click", function () {
							activeArchive = this.getAttribute("data-archive");
							renderFilters();
							applyFilter();
						});
					});
				}

				container.innerHTML = photoDays
					.map(function (item) {
						var cap = item.dateDisplay + " · " + item.location;
						var imgs = (item.allPhotos || item.photos || [])
							.map(function (src) {
								return (
									'<div class="tour-photo-item">' +
									'<img src="' +
									escapeHtml(src) +
									'" alt="' +
									escapeHtml(cap) +
									'" data-caption="' +
									escapeHtml(cap) +
									'" loading="lazy" onclick="openPhotoLightbox(this)" />' +
									"</div>"
								);
							})
							.join("");

						return (
							'<div class="tour-day-block" data-archive="' +
							escapeHtml(item.archive) +
							'" style="margin-bottom: 28px;">' +
							'<div class="show-context-card photos-context">' +
							'<div class="show-context-details">' +
							"<strong>Date:</strong> " +
							escapeHtml(item.dateDisplay) +
							"<br />" +
							"<strong>Location:</strong> " +
							escapeHtml(item.location) +
							"<br />" +
							"<strong>Archive:</strong> " +
							escapeHtml(item.archive) +
							"</div>" +
							"</div>" +
							'<div class="tour-photo-grid">' +
							imgs +
							"</div>" +
							"</div>"
						);
					})
					.join("");

				var searchInput = document.getElementById("photos-search-input");
				function applyFilter() {
					var q = (searchInput.value || "").toLowerCase().trim();
					Array.from(container.querySelectorAll(".tour-day-block")).forEach(
						function (block) {
							var matchesArchive =
								activeArchive === "ALL" ||
								block.getAttribute("data-archive") === activeArchive;
							var matchesText =
								!q || block.textContent.toLowerCase().indexOf(q) !== -1;
							block.style.display =
								matchesArchive && matchesText ? "" : "none";
						}
					);
				}

				searchInput.addEventListener("keyup", applyFilter);
				renderFilters();
			});
	});
</script>
