const rooms = [
  {
    id: "balcony",
    name: "Balcony",
    floor: 2,
    guests: [
      ["Ageirim", "green", "20:45", true, ["phone", "bag"], "👩🏻"],
      ["Aliya", "yellow", "21:15", false, ["glasses", "cup"], "👩🏼"],
      ["Madina", "green", "22:10", false, ["phone", "bag"], "👩🏽"],
      ["Ivan", "black", "20:10", true, ["phone"], "👨🏻"],
    ],
  },
  {
    id: "hall",
    name: "Hall",
    floor: 2,
    guests: [
      ["Arman", "yellow", "20:30", false, ["phone", "glasses"], "👨🏼"],
      ["Sophia", "purple", "21:20", true, ["phone", "bag"], "👩🏼"],
      ["Dias", "green", "19:45", true, ["phone", "glasses"], "👨🏽"],
      ["Bekzat", "purple", "20:55", false, ["phone", "bag", "cup"], "👨🏻"],
      ["Aruzhan", "blue", "21:50", true, ["phone", "bag"], "👩🏻"],
      ["Saule", "green", "21:25", false, ["glasses"], "👩🏽"],
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    floor: 1,
    guests: [
      ["Nurlan", "red", "19:40", true, ["phone", "bag"], "👨🏽"],
      ["Emma", "black", "20:15", false, [], "👩🏻"],
      ["Timur", "green", "21:05", true, ["glasses", "bag", "cup"], "👨🏻"],
      ["Sergey", "yellow", "20:50", false, ["phone", "cup"], "👨🏼"],
      ["Yerlan", "red", "21:40", true, ["phone", "glasses"], "👨🏻"],
      ["Kamila", "green", "20:05", false, ["bag"], "👩🏩"],
    ],
  },
  {
    id: "living",
    name: "Living room",
    floor: 1,
    guests: [
      ["Daniel", "blue", "19:55", true, ["phone"], "👨🏽"],
      ["Zarina", "green", "21:10", false, ["phone", "bag", "cup"], "👩🏻"],
      ["Natasha", "yellow", "20:30", true, ["phone", "bag"], "👩🏼"],
      ["Askar", "blue", "21:00", true, ["phone"], "👨🏻"],
      ["Inkar", "purple", "20:20", false, ["bag"], "👩🏽"],
    ],
  },
];
const iconMap = {
  phone: "📱",
  glasses: "👓",
  bag: "👜",
  cup: "☕",
  crumbs: "🍰",
};
let expanded = null,
  sorted = false,
  moved = false;
const cases = [
  "Who is in the hall?",
  "Who is dressed in yellow or purple?",
  "Which AITU students are upstairs?",
  "Who has glasses or a bag?",
  "Who came with nothing at all?",
  "Who has a phone but no bag?",
  "Who arrived between 20:30 and 21:00, both included?",
  "Who arrived after 21:00 and is not an AITU student?",
  "Who stands right next to Askar?",
  "Who stands last in each room?",
  "Who stands third in each room?",
  "Who stands after Timur in his room?",
  "Who stands right before someone in black?",
  "In which room is Aruzhan?",
  "Which rooms have fewer than 6 guests?",
  "In which rooms does somebody have a cup, but nobody wears glasses?",
  "Who came first to each room?",
  "Miras joins Askar and Inkar at 21:20.",
  "Natasha says goodbye and goes home.",
  "Who took the cake?",
];
function guestObject(a, room) {
  return {
    name: a[0],
    color: a[1],
    time: a[2],
    aitu: a[3],
    items: a[4],
    face: a[5],
    room: room.name,
    floor: room.floor,
  };
}
function allGuests() {
  return rooms.flatMap((r) => r.guests.map((g) => guestObject(g, r)));
}
function render() {
  rooms.forEach((r) => {
    const $list = $("#" + r.id + " .guest-list").empty();
    r.guests.forEach((g, i) => {
      const [name, color, time, aitu, items, face] = g;
      const $card = $(
        `<div class="guest-card" tabindex="0"><div class="avatar">${face}</div><div class="guest-name"></div><div class="guest-time"></div><div class="icons"></div><div class="details"></div></div>`,
      );
      $card.attr({
        "data-name": name,
        "data-color": color,
        "data-time": time,
        "data-aitu": aitu ? "true" : "false",
        "data-room": r.name,
        "data-floor": r.floor,
        "data-items": items.join(" "),
        "data-index": i,
      });
      $card.find(".avatar").css("--cloth", colorCss(color));
      $card.find(".guest-name").text(name);
      $card.find(".guest-time").text("◷ " + time);
      $card
        .find(".icons")
        .html(
          items.map((x) => iconMap[x]).join(" ") +
            (aitu ? ' <span class="badge">🔵</span>' : ""),
        );
      $card
        .find(".details")
        .text(
          `${r.name} · Floor ${r.floor} · ${color} clothing · ${time} · ${aitu ? "AITU student" : "Not an AITU student"} · ${items.length ? items.join(", ") : "no belongings"}`,
        );
      $card.on("click", function () {
        if ($(this).hasClass("expanded")) {
          $(this).removeClass("expanded");
          expanded = null;
        } else {
          $(".guest-card.expanded").removeClass("expanded");
          $(this).addClass("expanded");
          expanded = $(this);
        }
      });
      $list.append($card);
    });
  });
  $("#guestCount").text($(".guest-card").length);
}
function colorCss(c) {
  return (
    {
      red: "#e34e58",
      blue: "#4385d8",
      green: "#299b68",
      black: "#34383d",
      yellow: "#e8ad25",
      purple: "#9560cb",
    }[c] || "#888"
  );
}
function rebuild() {
  rooms[3].guests = rooms[3].guests.filter((g) => g[0] !== "Miras");
  rooms[1].guests = rooms[1].guests.filter((g) => g[0] !== "Miras");
  rooms[3].guests = rooms[3].guests.filter((g) => g[0] !== "Natasha");
  rooms[3].guests.splice(3, 0, [
    "Natasha",
    "yellow",
    "20:30",
    true,
    ["phone", "bag"],
    "👩🏼",
  ]);
  rooms[1].guests = rooms[1].guests.map((g) => g);
  sorted = false;
  moved = false;
  render();
}
function cards() {
  return $(".guest-card");
}
function byName(n) {
  return cards().filter(function () {
    return $(this).data("name") === n;
  });
}
function highlight($found, description, caseNo) {
  cards().removeClass("found dimmed");
  $found.addClass("found");
  if ($found.length) cards().not($found).addClass("dimmed");
  $found.each(function () {
    $(this)
      .stop(true, true)
      .animate({ top: "-5px" }, 130)
      .animate({ top: "0px" }, 130);
  });
  $("#result").html(
    `<b>Case ${caseNo}:</b> ${description}<br><b>Found (${$found.length}):</b> ${
      $found
        .map(function () {
          return $(this).data("name");
        })
        .get()
        .join(", ") || "No matching guests."
    }`,
  );
}
function runCase(n) {
  rebuild();
  $(".case-btn")
    .removeClass("active")
    .filter(`[data-case="${n}"]`)
    .addClass("active");
  let $f = $();
  let desc = "";
  const t = cards();
  const timeVal = (s) => Number(s.replace(":", "."));
  switch (n) {
    case 1:
      $f = t.filter('[data-room="Hall"]');
      desc = "All guest cards in the Hall.";
      break;
    case 2:
      $f = t.filter('[data-color="yellow"], [data-color="purple"]');
      desc = "Guests wearing yellow or purple.";
      break;
    case 3:
      $f = t.filter('[data-aitu="true"][data-floor="2"]');
      desc = "AITU students on the second floor.";
      break;
    case 4:
      $f = t.filter(function () {
        let x = $(this).data("items");
        return x.includes("glasses") || x.includes("bag");
      });
      desc = "Guests who have glasses or a bag.";
      break;
    case 5:
      $f = t.filter('[data-items=""]');
      desc = "Guests with no belongings.";
      break;
    case 6:
      $f = t.filter(function () {
        let x = ($(this).data("items") || "").split(" ");
        return x.includes("phone") && !x.includes("bag");
      });
      desc = "Guests with a phone but without a bag.";
      break;
    case 7:
      $f = t.filter(function () {
        let x = timeVal($(this).data("time"));
        return x >= 20.3 && x <= 21.0;
      });
      desc = "Arrival time from 20:30 through 21:00, inclusive.";
      break;
    case 8:
      $f = t.filter(function () {
        return (
          timeVal($(this).data("time")) > 21 && $(this).data("aitu") === false
        );
      });
      desc = "Arrived after 21:00 and are not AITU students.";
      break;
    case 9:
      $f = byName("Askar")
        .next(".guest-card")
        .add(byName("Askar").prev(".guest-card"));
      desc = "The previous and next cards beside Askar in the living room.";
      break;
    case 10:
      $(".room").each(function () {
        $f = $f.add($(this).find(".guest-card").last());
      });
      desc = "The last guest card in every room.";
      break;
    case 11:
      $(".room").each(function () {
        $f = $f.add($(this).find(".guest-card").eq(2));
      });
      desc = "The third guest card in every room.";
      break;
    case 12:
      $f = byName("Timur").nextAll(".guest-card");
      desc = "Everyone standing after Timur in the kitchen.";
      break;
    case 13:
      $f = t.filter(function () {
        return $(this).nextAll(".guest-card").first().data("color") === "black";
      });
      desc = "Guests whose next neighbor wears black.";
      break;
    case 14:
      $f = $(".room")
        .has('.guest-card[data-name="Aruzhan"]')
        .find(".guest-card");
      desc = "All guest cards in the room containing Aruzhan.";
      break;
    case 15:
      $f = $(".room")
        .filter(function () {
          return $(this).find(".guest-card").length < 6;
        })
        .find(".guest-card");
      desc = "Guest cards in rooms containing fewer than six guests.";
      break;
    case 16:
      $f = $(".room")
        .filter(function () {
          let $r = $(this);
          return (
            $r.find('.guest-card[data-items*="cup"]').length > 0 &&
            $r.find('.guest-card[data-items*="glasses"]').length === 0
          );
        })
        .find(".guest-card");
      desc = "Guest cards in rooms with at least one cup and no guest wearing glasses.";
      break;
    case 17:
      $(".room").each(function () {
        let $room = $(this);
        let min = "99:99",
          $first = $();
        $room.find(".guest-card").each(function () {
          let tm = $(this).data("time");
          if (tm < min) {
            min = tm;
            $first = $(this);
          }
        });
        $f = $f.add($first);
      });
      desc = "The earliest arrival in each room.";
      break;
    case 18:
      $("#living .guest-list")
        .find(".guest-card")
        .each(function () {
          if ($(this).data("name") === "Askar") {
            $(this).after(makeMiras());
          }
        });
      $("#living .guest-list")
        .find(".guest-card")
        .each(function () {
          if ($(this).data("name") === "Inkar") {
            $(this).before(makeMiras());
          }
        });
      $("#living .guest-list")
        .find(".guest-card")
        .filter('[data-name="Miras"]')
        .last()
        .remove();
      let $askar = byName("Askar");
      let $m = makeMiras();
      $askar.after($m);
      $f = $m;
      desc =
        "Miras is inserted between Askar and Inkar using jQuery DOM insertion.";
      break;
    case 19:
      $f = byName("Natasha");
      $f.fadeOut(350, function () {
        $(this).remove();
      });
      desc = "Natasha leaves; her card fades out and is removed.";
      break;
    case 20:
      $("#living .guest-list").find('[data-name="Askar"]').after(makeMiras());
      $f = byName("Miras");
      desc =
        "Miras arrived at 21:20, has a phone and cake crumbs, has no cup, and stands beside AITU student Askar. Miras is the cake thief.";
      break;
  }
  if (n !== 19 && n !== 18) highlight($f, desc, n);
  else {
    $("#result").html(
      `<b>Case ${n}:</b> ${desc}<br><b>Found:</b> ${n === 18 ? "Miras" : "Natasha (leaving)"}`,
    );
    if (n === 18) $f.addClass("found");
  }
}
function makeMiras() {
  let $c = $(
    `<div class="guest-card" tabindex="0" data-name="Miras" data-color="blue" data-time="21:20" data-aitu="true" data-room="Living room" data-floor="1" data-items="phone crumbs"><div class="avatar">🧑🏻</div><div class="guest-name">Miras</div><div class="guest-time">◷ 21:20</div><div class="icons">📱 🍰 <span class="badge">🔵</span></div><div class="details">Living room · Floor 1 · blue clothing · 21:20 · AITU student · phone, cake crumbs</div></div>`,
  );
  $c.find(".avatar").css("--cloth", colorCss("blue"));
  $c.on("click", function () {
    if ($(this).hasClass("expanded")) $(this).removeClass("expanded");
    else {
      $(".guest-card.expanded").removeClass("expanded");
      $(this).addClass("expanded");
    }
  });
  return $c;
}
function buildCases() {
  cases.forEach((c, i) =>
    $("#caseGrid").append(
      `<button class="case-btn" data-case="${i + 1}"><b>${String(i + 1).padStart(2, "0")}</b> · ${c}</button>`,
    ),
  );
  $(".case-btn").on("click", function () {
    runCase(Number($(this).data("case")));
  });
}
$("#clearBtn").on("click", function () {
  cards().removeClass("found dimmed");
  $("#result").text("Spotlight cleared. All guests are visible again.");
  $(".case-btn").removeClass("active");
});
$(document).on("keydown", function (e) {
  if (e.key === "Escape") {
    $(".guest-card.expanded").removeClass("expanded");
    expanded = null;
  }
});
$('[data-motion="spotlight"]').on("click", () => {
  runCase(3);
  cards().not(".found").stop(true, true).fadeTo(250, 0.2);
  $("#motionStatus").text(
    "Spotlight: case 3 is bright; all other guest cards fade to 20% opacity.",
  );
});
$('[data-motion="clear"]').on("click", () => {
  cards().stop(true, true).fadeTo(200, 1).removeClass("found dimmed");
  $("#result").text("All guest cards are bright again.");
  $("#motionStatus").text("Clear restores every guest card to full opacity.");
});
$('[data-motion="hint"]').on("click", () =>
  $("#motionStatus").text(
    "Click any guest card to expand it. Click again or press Esc to shrink it back. Only one card can stay expanded.",
  ),
);
$('[data-motion="move"]').on("click", function () {
  let $a = byName("Arman");
  let $clone = $a.clone(true);
  let $target = $("#balcony .guest-list");
  let start = $a.offset(),
    end = $target.offset();
  $a.css("position", "relative").animate(
    { left: end.left - start.left, top: end.top - start.top, opacity: 0.25 },
    500,
    () => {
      $a.css({ left: 0, top: 0, opacity: 1 });
      $a.remove();
      $clone
        .appendTo($target)
        .css({ position: "relative", left: 100, opacity: 0.3 })
        .animate({ left: 0, opacity: 1 }, 500);
      $("#motionStatus").text(
        "Arman has moved from the Hall to the Balcony. The Hall gap closes after the card leaves.",
      );
    },
  );
});
$('[data-motion="sort"]').on("click", function () {
  let $list = $("#living .guest-list");
  let $items = $list.children(".guest-card").get();
  if (!sorted) {
    $items.sort((a, b) => $(a).data("time").localeCompare($(b).data("time")));
    sorted = true;
    $("#motionStatus").text(
      "Living room sorted from earliest to latest arrival. Click again to restore the original order.",
    );
  } else {
    $items.sort(
      (a, b) => Number($(a).data("index")) - Number($(b).data("index")),
    );
    sorted = false;
    $("#motionStatus").text("Original living-room order restored.");
  }
  $items.forEach((el, i) =>
    $(el)
      .stop(true)
      .animate({ opacity: 0.65 }, 100)
      .appendTo($list)
      .animate({ opacity: 1 }, 250),
  );
});
render();
buildCases();
if (new URLSearchParams(location.search).has("case"))
  runCase(Number(new URLSearchParams(location.search).get("case")));
