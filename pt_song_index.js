(function () {
    var bd = NEJ.P,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        bm = bd("nej.u"),
        gA = bd("nm.ut");
    gA.bYr = function () {
            var bdS = function (cH, fy, nP, nS, vT) {
                if (nP < nS) {
                    var BX = Math.floor((nP + nS) / 2);
                    bdS(cH, fy, nP, BX, vT);
                    bdS(cH, fy, BX + 1, nS, vT);
                    bYt(cH, fy, nP, BX, nS, vT)
                }
            };
            var bYt = function (cH, fy, nP, BX, nS, vT) {
                var i = nP,
                    j = BX + 1,
                    k = nP;
                while (i <= BX && j <= nS) {
                        if (vT(cH[i], cH[j]) <= 0) {
                            fy[k++] = cH[i++]
                        } else {
                            fy[k++] = cH[j++]
                        }
                    }
                while (i <= BX) {
                        fy[k++] = cH[i++]
                    }
                while (j <= nS) {
                        fy[k++] = cH[j++]
                    }
                for (i = nP; i <= nS; i++) {
                        cH[i] = fy[i]
                    }
            };
            var bYv = function (jQ, bYB) {
                return jQ < bYB
            };
            return function (cH, vT) {
                if (!cH || cH.length == 0) return cH;
                vT = vT || bYv;
                bdS(cH, new Array(cH.length), 0, cH.length - 1, vT);
                return cH
            }
        }();
    gA.bdY = function () {
            var gK = /\r\n|\r|\n/,
                jY = /\[(.*?)\]/gi,
                bdZ = {
                    ar: "artist",
                    ti: "track",
                    al: "album",
                    offset: "offset"
                };
            var bea = function (bp, iz) {
                    var cH = [];
                    iz = iz.replace(jY, function ($1, $2) {
                        var cT = beb.call(this, bp, $2);
                        if (cT != null) {
                            cH.push({
                                time: cT,
                                tag: $2
                            });
                            bp.scrollable = !0
                        }
                        return ""
                    }.bi(this)).trim();
                    if (!cH.length) {
                        if (!iz || iz.length == 0) return;
                        cH.push({
                            time: -1
                        })
                    }
                    bm.cv(cH, function (bw) {
                        bw.lyric = iz
                    });
                    var uP = bp.lines;
                    uP.push.apply(uP, cH)
                };
            var beb = function (bp, cT) {
                    var cH = cT.split(":"),
                        sI = cH.shift(),
                        bN = bdZ[sI];
                    if ( !! bN) {
                            bp[bN] = cH.join(":");
                            return null
                        }
                    sI = parseInt(sI);
                    if (isNaN(sI)) {
                            return null
                        } else {
                            var cq = parseInt(bp.offset) || 0;
                            return sI * 60 + parseFloat(cH.join(".")) + cq / 1e3
                        }
                };
            var bed = function (bee, bef) {
                    return bee.time - bef.time
                };
            return function (bB, cm) {
                    var bp = {
                        id: bB,
                        lines: [],
                        scrollable: !1,
                        source: cm
                    };
                    bm.cv((cm || "").trim().split(gK), bea.bi(null, bp));
                    if (bp.scrollable) {
                        gA.bYr(bp.lines, bed);
                        var bv;
                        for (var i = 0; i < bp.lines.length; i++) {
                            if ( !! bp.lines[i].lyric) {
                                bv = i;
                                break
                            }
                        }
                        bp.lines.splice(0, bv)
                    }
                    return bp
                }
        }();
    gA.boe = function (sD, Rm) {
            var bek = gA.bdY(0, sD),
                bel = gA.bdY(0, Rm);
            if (bek.scrollable && bel.scrollable) {
                    bm.cv(bek.lines, function (bw) {
                        var Rn = getTranslate(bw.time);
                        if (Rn) {
                            bw.lyric = bw.lyric + "<br>" + Rn.lyric
                        }
                    })
                }
            return bek;

            function getTranslate(cT) {
                    var bv = bm.eg(bel.lines, function (bw) {
                        return bw.time == cT
                    });
                    if (bv != -1) {
                        return bel.lines[bv]
                    }
                }
        }
})();
(function () {
    var bd = NEJ.P,
        cg = NEJ.O,
        cC = NEJ.F,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        bA = bd("nej.j"),
        bm = bd("nej.u"),
        bn = bd("nm.x"),
        bo = bd("nm.l"),
        bq = bd("nm.d");
    var bod = function (bl) {
            if (bl.errorType == 6 || bl.errorType == 7 || bl.errorType == 8) {
                if (!bn.ic()) return;
                bn.lg({
                    txt: "m-report-point",
                    title: "提示",
                    onaction: bnZ.bi(this, bl)
                })
            } else {
                bnZ(bl)
            }
        };
    var bYL = function (be) {
            var bh = bj.bY(be, "d:action");
            if (bb.bz(bh, "action") == "feedLyric") {
                bj.cu(be);
                var dX = bb.bz(bh, "code"),
                    bl = {
                        songId: bb.bz(bh, "id"),
                        errorType: dX
                    };
                bod(bl)
            }
        };
    var bnZ = function (bl, be) {
            if (!be || be.action == "ok") {
                bA.cG("/api/v1/feedback/lyric", {
                    type: "json",
                    method: "post",
                    data: bm.eX(bl),
                    onload: function (be) {
                        if (be.code == 200) {
                            bo.ci.bR({
                                tip: "提交成功"
                            });
                            if (bm.hC(bl.onok)) {
                                bl.onok()
                            }
                        } else if (be.code == -2) {
                            bn.iu({
                                title: "提示",
                                message: "您的积分不足",
                                btnok: "赚积分",
                                action: function (cl) {
                                    if (cl == "ok") {
                                        location.dispatch2("/store/gain/index")
                                    }
                                }
                            })
                        } else {
                            bo.ci.bR({
                                type: 2,
                                tip: "提交失败"
                            })
                        }
                    }
                })
            }
        };
    bn.bnT = function (bh) {
            var bh = bh || document.body,
                lI = bYL.bi(this);
            bj.bt(bh, "click", lI);
            return {
                    destroy: function () {
                        bj.oz(bh, "click", lI)
                    }
                }
        };
    bn.cdA = function (bl) {
            bod(bl)
        }
})();
(function () {
    var bd = NEJ.P,
        cC = NEJ.F,
        bI = bd("nej.ut"),
        bm = bd("nej.u"),
        bj = bd("nej.v"),
        bA = bd("nej.j"),
        bo = bd("nm.l"),
        bq = bd("nm.d"),
        bc;
    bq.fX({
            "artist_sub-list": {
                url: "/api/artist/sublist",
                type: "GET",
                format: function (bV, bf) {
                    var bk = bV.data || [];
                    bk.length = bf.data.limit;
                    return {
                        total: bV.count || 0,
                        list: bk
                    }
                }
            },
            "artist_sub-add": {
                url: "/api/artist/sub",
                type: "GET",
                format: function (bV, bf) {
                    bo.ci.bR({
                        tip: "收藏成功",
                        type: 1
                    });
                    bj.bK(bq.sz, "itemchange", {
                        id: bf.data.artistId,
                        subscribed: true
                    })
                },
                onmessage: function (dX) {
                    var lJ = {
                        405: "你操作太快了，请休息一会再试！",
                        406: "你操作太快了，请休息一会再试！"
                    };
                    bo.ci.bR({
                        tip: lJ[dX] || "收藏失败",
                        type: 2
                    })
                }
            },
            "artist_sub-del": {
                url: "/api/artist/unsub",
                type: "GET",
                filter: function (bf) {
                    bf.data.artistIds = "[" + bf.data.artistId + "]"
                },
                format: function (bV, bf) {
                    bo.ci.bR({
                        tip: "取消收藏成功",
                        type: 1
                    });
                    bj.bK(bq.sz, "itemchange", {
                        id: bf.data.artistId,
                        subscribed: false
                    })
                },
                onmessage: function (dX) {
                    var lJ = {
                        405: "你操作太快了，请休息一会再试！",
                        406: "你操作太快了，请休息一会再试！"
                    };
                    bo.ci.bR({
                        tip: lJ[dX] || "收藏失败",
                        type: 2
                    })
                }
            }
        });
    bq.sz = NEJ.C();
    bc = bq.sz.bU(bq.ik);
    bc.dv = function () {
            this.dC()
        };
    bI.gN.bF({
            element: bq.sz,
            event: ["listchange", "itemchange"]
        })
})();
(function () {
    var bd = NEJ.P,
        cg = NEJ.O,
        cC = NEJ.F,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        bI = bd("nej.ut"),
        bm = bd("nej.u"),
        cA = bd("nej.ui"),
        bn = bd("nm.x"),
        bq = bd("nm.d"),
        bT = bd("nm.w"),
        ez = bd("nm.i"),
        bc;
    var RES_KEY_REG = /^track_(playlist|album|artist_top|program|day|listen_record)-*(\d*)$/;
    bT.xn = NEJ.C();
    bc = bT.xn.bU(cA.gh);
    bc.dx = function () {
            this.dy = "m-wgt-song-box"
        };
    bc.dm = function () {
            this.dw();
            var bk = bb.bP(this.bs, "j-flag");
            this.dk = {
                limit: 1e3,
                parent: bk[0],
                onbeforelistload: this.pF.bi(this),
                onemptylist: this.uZ.bi(this),
                onafterlistrender: this.vn.bi(this)
            }
        };
    bc.cz = function (bf) {
            this.cB(bf);
            this.dq([
                [this.bs, "click", this.cS.bi(this)],
                [window, "playchange", this.iH.bi(this)]
            ]);
            var cN = bm.iO(location.search.slice(1)),
                rG = cN["_hash"];
            if (rG && /^songlist-(\d+)$/.test(rG)) {
                    this.Of = RegExp.$1
                }
            if (bf.limit > 0) this.dk.limit = bf.limit;
            this.dk.item = {
                    klass: bf.tpl || "m-wgt-song-list",
                    canDel: bf.canDel,
                    type: bf.type,
                    disable: this.ZQ,
                    songAlia: bn.bgZ,
                    dur2time: bn.nJ,
                    getArtistName: bn.ph,
                    isPlaying: this.ZR,
                    extData: bf.extData
                };
            this.dk.cache = {
                    clear: true,
                    klass: bq.uH,
                    lkey: bf.key,
                    data: bf.data
                };
            this.dk.item.from = this.brb();
            this.dk.item.getFrom = this.brb.bi(this);
            if (this.eI) {
                    this.eI.bW()
                }
            this.eI = bI.ju.bF(this.dk)
        };
    bc.cR = function () {
            this.cV();
            if (this.eI) {
                this.eI.bW();
                delete this.eI
            }
            delete this.Of
        };
    bc.cS = function (be) {
            var bh = bj.bY(be, "d:resAction"),
                cl = bb.bz(bh, "resAction"),
                bB = bb.bz(bh, "resId");
            var co = this.eI.te().fw(bB);
            var gr = bn.oP(co),
                wR = co.privilege || {};
            switch (cl) {
                case "mv":
                    if (gr != 100) {
                        location.dispatch2("/mv?id=" + co.mvid)
                    } else {
                        bn.kK()
                    }
                    break;
                case "play":
                case "addto":
                case "download":
                case "share":
                case "fav":
                case "subscribe":
                    if (cl == "play") {
                        var bk = this.eI.te().hT(this.dk.cache.lkey) || [];
                        this.bK("onplay", {
                            song: co,
                            index: bm.eg(bk, function (bw) {
                                return bw.id == co.id
                            })
                        })
                    }
                    if (cl == "download" && gr == 1e3) {
                        bn.kK("因版权方要求，该歌曲不支持下载");
                        bj.cu(be)
                    } else if ((cl == "play" || cl == "addto") && gr == 11) {
                        bn.bsT(co.id, 18);
                        bj.cu(be)
                    } else if (gr == 10) {
                        bn.sK(wR.fee || co.fee, co.id, "song", null, wR);
                        bj.cu(be)
                    } else if (gr == 100) {
                        bn.kK(null, null, null, true, co);
                        bj.cu(be)
                    }
                    break;
                case "delete":
                    bn.iu({
                        btnok: "确定",
                        btncc: "取消",
                        message: "确定删除歌曲？",
                        action: function (bD) {
                            if (bD == "ok") {
                                this.eI.mw({
                                    pid: this.dk.cache.data.id,
                                    trackIds: [bB]
                                })
                            }
                        }.bi(this)
                    });
                    break;
                default:
                    this.bK("onaction", {
                        action: cl,
                        id: bB
                    })
                }
        };
    bc.pF = function (be) {
            be.value = '<div class="u-load s-fc4"><i class="icn"></i> 加载中...</div>';
            this.bK("onbeforelistload", be)
        };
    bc.uZ = function (be) {
            be.value = '<div class="n-nmusic"><h3 class="f-ff2"><i class="u-icn u-icn-21"></i>暂无音乐</h3></div>';
            this.bK("onemptylist", be)
        };
    bc.vn = function (be) {
            if (this.Of) {
                bb.nw(this.Of + "" + bb.Fq());
                delete this.Of
            }
            this.bK("onafterlistrender", be)
        };
    bc.ZQ = function (co) {
            return bn.oP(co) == 100
        };
    bc.iH = function (be) {
            var ZT = bb.bP(this.bs, "ply-z-slt") || [],
                hb = bb.bG(be.trackId + "" + bb.Fq());
            bm.cv(ZT, function (fQ) {
                    bb.bH(fQ, "ply-z-slt")
                });
            if (hb) {
                    bb.bJ(bb.bP(hb, "ply")[0], "ply-z-slt")
                }
        };
    bc.ZR = function (co) {
            try {
                var pO = top.player.getPlaying();
                return pO && pO.track.id == co.id
            } catch (e) {}
        };
    bc.brb = function () {
            var ZV, kb = {},
                cE = {
                    playlist: 13,
                    album: 19,
                    artist_top: 2,
                    program: 17,
                    day: 24,
                    listen_record: 50
                };
            if (ZV = RES_KEY_REG.exec(this.dk.cache.lkey)) {
                    kb.fid = cE[ZV[1]];
                    kb.fdata = ZV[2] || 0;
                    if (kb.fid == 50) {
                        kb.fdata = this.dk.cache.data.uid + "|" + this.dk.cache.data.type
                    }
                    return kb
                }
        };
    bc.Bp = function (dS, sm) {
            if (!this.eI) return false;
            var bk = this.eI.te().hT(this.dk.cache.lkey) || [];
            return bn.FW(bk, dS, sm).length == 0
        };
    bc.bUu = function () {
            if (!this.eI) return true;
            var bk = this.eI.te().hT(this.dk.cache.lkey) || [];
            return bn.FW(bk, false, {
                play: true
            }).length < bk.length
        };
    bc.bUv = function () {
            return this.eI
        };
    bc.bqY = function () {
            var bk = this.eI.te().hT(this.dk.cache.lkey) || [],
                bp = [],
                gr = null;
            for (var i = bk.length - 1, ii; i >= 0; i--) {
                    ii = bk[i];
                    gr = bn.oP(ii);
                    if (gr != 10 && gr != 100) {
                        bp.unshift(ii)
                    }
                }
            return bp
        };
    bc.baa = function () {
            var co, Gx, bk = this.bac().slice(0);
            while (bk.length) {
                co = bk.shift();
                Gx = co.privilege;
                if (!Gx) {
                    Gx = {
                        fee: co.fee,
                        cp: -co.status,
                        pl: 192,
                        dl: 192,
                        toast: false,
                        st: 0
                    }
                }
                if (Gx.cp > 0) {
                    return null
                }
            }
            return {
                songId: co.id,
                fee: Gx.fee,
                cp: Gx.cp,
                pl: Gx.pl,
                dl: Gx.dl,
                toast: Gx.toast,
                st: Gx.st
            }
        };
    bc.bac = function () {
            return this.eI.te().hT(this.dk.cache.lkey) || []
        };
    bc.mt = function () {
            return !this.eI.te().hT(this.dk.cache.lkey).length
        }
})();
(function () {
    var bd = NEJ.P,
        bb = bd("nej.e"),
        bm = bd("nej.u"),
        fc = bd("nej.ut"),
        bT = bd("nm.w"),
        bc;
    var ciQ = typeof GEnvType == "undefined" || GEnvType == "online" ? "http://iad.g.163.com" : "http://t.rec.g.163.com/accuad";
    bT.ciF = NEJ.C();
    bc = bT.ciF.bU(fc.dZ);
    var ciP = {
            homepage: "column689x75",
            detail: "logo200x220"
        };
    bc.cz = function (bf) {
            bf = bf || {};
            this.cB(bf);
            this.bs = bb.bG("j-music-ad");
            if (!this.bs) return;
            this.ciG = bf.cat || "";
            this.ciO = bb.bz(this.bs, "hasMusicAd") == "1";
            var bk = bb.bP(this.bs, "j-flag");
            this.KS = bk.shift();
            this.ciH = bk.shift();
            this.ciN();
            this.dq([
                [this.KS, "click", this.gB.bi(this)]
            ])
        };
    bc.ciN = function () {
            var gP = "g_cb" + bm.blF(5),
                bZ = ciQ + "/wa/ad_check?",
                jF = {
                    site: "netease",
                    affiliate: "music",
                    cat: this.ciG,
                    type: ciP[this.ciG],
                    location: 1,
                    callback: gP
                },
                RW = document.createElement("script");
            window[gP] = this.ciM.bi(this);
            RW.src = bZ + bm.eX(jF);
            RW.id = "j-script-ad";
            RW.type = "text/javascript";
            this.ciL = gP;
            document.body.appendChild(RW)
        };
    bc.ciM = function (hy) {
            if (hy && hy.result) {
                bb.bH(this.bs, "f-hide");
                bb.bH(this.ciH, "f-hide");
                bb.bJ(this.KS, "f-hide")
            } else if (this.ciO) {
                bb.bH(this.bs, "f-hide");
                bb.bH(this.KS, "f-hide");
                bb.bJ(this.ciH, "f-hide");
                this.ciK(bb.bz(this.KS, "id"), bb.bz(this.KS, "url"), bb.bz(this.KS, "pageid"), bb.bz(this.KS, "pagetype"))
            } else {
                bb.bJ(this.bs, "f-hide");
                bb.bJ(this.KS, "f-hide");
                bb.bJ(this.ciH, "f-hide")
            }
            bb.dW(bb.bG("j-script-ad"));
            delete window[this.ciL]
        };
    bc.ciK = function (bB, bZ, ciJ, ciI) {
            var bV = null;
            if (this.ciG == "homepage") {
                bV = {
                    id: +bB,
                    url: bZ,
                    page: "recommend",
                    position: "upnewsong"
                }
            } else if (this.ciG == "detail") {
                bV = {
                    id: +bB,
                    url: bZ,
                    pageid: +(ciJ || ""),
                    pageType: ciI || "",
                    page: "innerdetail",
                    position: "uprelated"
                }
            }
            if (bV && window.log) {
                window.log("adimpress", bV)
            }
        };
    bc.gB = function (be) {
            var bB = bb.bz(this.KS, "id"),
                bu = this.ciG == "homepage" ? "100_0" : "101_0";
            bA.cG("/api/ad/click", {
                    method: "post",
                    type: "json",
                    data: bm.eX({
                        type_adid: bu + bB
                    })
                })
        }
})();
(function () {
    var bd = NEJ.P,
        bj = bd("nej.v"),
        bI = bd("nej.ut"),
        bq = bd("nm.d"),
        bo = bd("nm.l"),
        bm = bd("nej.u"),
        bc, bO;
    bq.fX({
            "comment-list": {
                url: "/api/v1/resource/comments/{rid}/",
                format: function (bV, bf) {
                    if (bV.currentComment) {
                        this.rq("comment_cur-" + bf.data.rid, [bV.currentComment])
                    }
                    if (bV.hotComments) {
                        this.rq("comment_hot-" + bf.data.rid, bV.hotComments)
                    }
                    if (/R_SO_(\d)_(\d+)/.test(bf.data.rid)) this.bUD(bV.comments, RegExp.$2);
                    var baf = bV.comments || [];
                    if (bV.more && baf.length < bf.data.limit) {
                        baf.length = bf.data.limit
                    }
                    return {
                        total: bV.total || 0,
                        list: baf
                    }
                },
                finaly: function (be) {
                    bj.bK(bq.pY, "listchange", be)
                }
            },
            "comment-add": {
                url: "/api/resource/comments/add",
                format: function (bV, bf) {
                    bo.ci.bR({
                        tip: "评论成功"
                    });
                    return bV.comment
                },
                finaly: function (be) {
                    bj.bK(bq.pY, "listchange", be)
                },
                onmessage: function (dX, bp) {
                    var dS = "评论失败";
                    if (dX == 407) {
                        bo.ci.bR({
                            tip: "评论成功"
                        });
                        bj.bK(bq.pY, "listchange", {
                            action: "add"
                        });
                        return
                    } else if (dX == 404) {
                        dS = "评论的资源已被删除"
                    } else if (dX == 315) {
                        dS = "根据对方设置，你没有该操作权限"
                    } else if (dX == 405) {
                        dS = bp.message || "评论过于频繁"
                    }
                    bo.ci.bR({
                        tip: dS,
                        type: 2
                    })
                }
            },
            "comment-del": {
                url: "/api/resource/comments/delete",
                filter: function (hl, cj) {
                    if (hl.data.type == "hot") {
                        cj.url = "/api/report/reportcomment";
                        hl.data.reason = "段子或无意义的评论";
                        hl.data.type = 0
                    } else if (hl.data.type == "admin") {
                        cj.url = "/api/comment/delete"
                    } else {
                        cj.url = "/api/resource/comments/delete"
                    }
                },
                format: function (bV, bf) {
                    var zB = this.hT("comment_hot-" + bf.data.threadId),
                        bv = bm.eg(zB, function (bw) {
                            return bw.commentId == bf.data.commentId
                        });
                    if (bv != -1) {
                            zB.splice(bv, 1)
                        }
                    if (bf.data.type == "hot" || bm.uu(bf.data.type)) {
                            var bw = this.fw(bf.data.commentId);
                            if (bw) {
                                bw.isRemoveHotComment = true
                            }
                            bj.bK(bq.pY, "listchange", {
                                action: "refresh",
                                key: bf.key
                            });
                            bo.ci.bR({
                                tip: "已从精彩评论中移除",
                                type: 1
                            });
                            return null
                        }
                    return this.fw(bf.data.commentId)
                },
                finaly: function (be) {
                    bj.bK(bq.pY, "listchange", be)
                },
                onmessage: function (dX) {
                    bo.ci.bR({
                        tip: "评论删除失败",
                        type: 2
                    })
                }
            },
            "comment-update": {
                url: "/api/v1/comment/like",
                filter: function (bf, cj) {
                    if (bf.data.like) {
                        cj.url = "/api/v1/comment/like"
                    } else {
                        cj.url = "/api/v1/comment/unlike"
                    }
                },
                format: function (bV, bf) {
                    var qD = this.fw(bf.data.commentId);
                    qD.liked = bf.data.like;
                    qD.likedCount = qD.likedCount || 0;
                    qD.likedCount = qD.likedCount + (qD.liked ? 1 : -1);
                    return qD
                },
                finaly: function (be) {
                    be.action = "refresh";
                    bj.bK(bq.pY, "listchange", be)
                },
                onmessage: function (dX) {
                    if (dX == 315) {
                        bo.ci.bR({
                            tip: "根据对方设置，你没有该操作权限",
                            type: 2
                        })
                    } else {
                        bo.ci.bR({
                            tip: "操作失败",
                            type: 2
                        })
                    }
                }
            },
            "comment-reply": {
                url: "/api/v1/resource/comments/reply",
                format: function (bV, bf) {
                    return bV.comment
                },
                finaly: function (be, bf) {
                    bj.bK(bq.pY, "listchange", be);
                    bo.ci.bR({
                        tip: "回复成功"
                    })
                },
                onmessage: function (dX) {
                    if (dX == 407) {
                        bo.ci.bR({
                            tip: "回复成功"
                        });
                        this.bK("onreply")
                    } else if (dX == 315) {
                        bo.ci.bR({
                            tip: "根据对方设置，你没有该操作权限",
                            type: 2
                        })
                    } else {
                        bo.ci.bR({
                            tip: "回复失败，请稍后再试",
                            type: 2
                        })
                    }
                }
            }
        });
    bq.pY = NEJ.C();
    bc = bq.pY.bU(bq.ik);
    bc.dv = function () {
            this.dC();
            this.kt = bq.kQ.bF()
        };
    bc.cz = function (bf) {
            this.cB(bf)
        };
    bc.cR = function () {
            this.cV()
        };
    bc.baj = function (bf) {
            bf.onload = this.CJ.bi(this, bf);
            this.dJ("comment-reply", bf)
        };
    bc.CJ = function (bf, bw) {
            bf.key = "comment-" + bf.data.threadId;
            var be = this.wF(bf, bw);
            this.bK("onreply", be);
            return be
        };
    bc.bUD = function (bk, bUK) {
            var bp = [];
            if (!bk || !bk.length) return;
            bm.cv(bk, function (bUN) {
                var bV = {
                    type: "song",
                    cid: bUN.commentId,
                    sourceid: bUK
                };
                bp.push({
                    action: "commentimpress",
                    json: bV
                })
            }, this);
            this.kt.OX(bp)
        };
    bI.gN.bF({
            element: bq.pY,
            event: "listchange"
        })
})();
(function () {
    var bd = NEJ.P,
        cg = NEJ.O,
        cC = NEJ.F,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        bm = bd("nej.u"),
        ej = bd("nej.p"),
        cA = bd("nej.ui"),
        bA = bd("nej.j"),
        bn = bd("nm.x"),
        bq = bd("nm.d"),
        bo = bd("nm.l"),
        bT = bd("nm.w"),
        gA = bd("nm.ut"),
        bc, bO;
    bT.zv = NEJ.C();
    bc = bT.zv.bU(cA.gh);
    bO = bT.zv.dr;
    bc.cz = function (bf) {
            this.cB(bf);
            this.fL = bf.type || 1;
            this.zu = bf.resource || {};
            this.Ou = bb.oZ(bb.dg("m-wgt-input-" + this.fL, {
                placeholder: bf.placeholder || ""
            }));
            this.bqK = bf.type == 2 ? true : false;
            var bk = bb.bP(this.Ou, "j-flag");
            this.gi = bk[0];
            this.bas = bb.bP(this.Ou, "btns")[0];
            this.pC = bk[3];
            this.bUV = bk[4];
            bb.gj(this.gi, "holder");
            if (bb.cU(this.gi.parentNode, "holder-parent")) {
                bb.ch(this.gi.parentNode, "display", "block")
            }
            this.gi.value = bf.input || "";
            this.bs.appendChild(this.Ou);
            this.oh = {
                start: 0,
                end: 0
            };
            if (!bf.nomention) {
                this.iI = bT.Ha.bF({
                    parent: document.body,
                    target: this.gi
                })
            } else {
                bb.ch(bk[2], "display", "none")
            }
            this.bau = bf.numLimit || 140;
            this.gv();
            this.bUZ();
            this.dq([
                [this.pC, "click", this.BU.bi(this)],
                [bk[2], "click", this.bax.bi(this)],
                [bk[1], "click", this.bay.bi(this)],
                [this.gi, "focus", this.kU.bi(this)],
                [this.gi, "input", this.iy.bi(this)],
                [this.gi, "keyup", this.sE.bi(this)],
                [this.gi, "click", this.lF.bi(this)]
            ]);
            if (!bm.hC(bf.onbeforesubmit)) this.bt("onbeforesubmit", this.bVa.bi(this));
            if (!bm.hC(bf.onloading)) this.bt("onloading", this.bVc.bi(this))
        };
    bc.cR = function () {
            this.gi.value = "";
            if (this.hG) {
                this.hG.bW();
                delete this.hG
            }
            if (this.iI) {
                this.iI.bW();
                delete this.iI
            }
            this.cV();
            bb.dW(this.Ou)
        };
    bc.bVa = function () {
            var bD = this.gi.value;
            if (this.pC.className.indexOf("dis") >= 0) return;
            if (!this.BQ() || !this.zf()) return;
            if (bn.jG(bD)) {
                bo.ci.bR({
                    type: 2,
                    tip: "输入点内容再提交吧"
                });
                return
            }
            if (bm.hk(bD) > 2 * this.bau) {
                bo.ci.bR({
                    type: 2,
                    tip: "输入不能超过" + this.bau + "个字符"
                });
                return
            }
            return !0
        };
    bc.bVc = function () {
            bb.bJ(this.pC, "u-btn-1-dis");
            if (this.pC.innerText.indexOf("...") < 0) {
                this.pC.innerText = this.pC.innerText + "..."
            }
            this.rm = !0
        };
    bc.wO = function () {
            if (!this.rm) return;
            this.rm = !1;
            bb.bH(this.pC, "u-btn-1-dis");
            var ew = this.pC.innerText;
            this.pC.innerText = ew.substring(0, ew.length - 3)
        };
    bc.lF = function () {
            this.oh = gA.sT(this.gi)
        };
    bc.BU = function (kf) {
            bj.cu(kf);
            var bD = this.gi.value;
            if (!this.bK("onbeforesubmit", {
                value: bD
            })) return;
            if (this.fL != 4) this.bK("onloading");
            gA.bAg(bD);
            if (this.iI) {
                this.iI.DP()
            }
            this.bK("onsubmit", bD);
            this.gv();
            return false
        };
    bc.yJ = function () {
            this.gi.value = "";
            this.gv()
        };
    bc.gn = function () {
            return this.gi.value || ""
        };
    bc.mK = function () {
            if (!this.zf()) return;
            var cF = this.gn().length;
            this.gi.focus();
            gA.Sx(this.gi, {
                start: cF,
                end: cF
            });
            this.lF()
        };
    bc.bax = function (be) {
            bj.cu(be);
            if (!this.zf()) return; !! this.hG && this.hG.cw();
            this.iI.GY();
            this.gv()
        };
    bc.bay = function (be) {
            bj.cu(be);
            if (!this.zf()) return;
            if (!this.hG) {
                this.hG = bo.DQ.bF({
                    parent: this.bas
                });
                this.hG.bt("onselect", this.vG.bi(this));
                bb.ch(this.hG.mL().parentNode, "position", "relative")
            }
            this.hG.bR()
        };
    bc.vG = function (be) {
            var cm = "[" + be.text + "]";
            bj.bK(this.gi, "focus");
            this.gi.focus();
            gA.Ea(this.gi, this.oh, cm);
            this.gv();
            bj.bK(this.gi, "keyup")
        };
    bc.iy = function (be) {
            ej.ek.browser == "ie" && ej.ek.version < "7.0" ? setTimeout(this.gv.bi(this), 0) : this.gv()
        };
    bc.sE = function (be) {
            this.lF();
            if (this.bqK) this.bVh();
            this.iy()
        };
    bc.BQ = function () {
            if (!GUser || !GUser.userId || GUser.userId < 0) {
                top.login();
                return
            }
            return true
        };
    bc.kU = function () {
            if (!this.BQ()) {
                this.gi.blur();
                return
            }
            if (!this.zf()) {
                this.gi.blur();
                return
            }
        };
    bc.gv = function () {
            var cF = this.bau - Math.ceil(bm.hk(this.gi.value) / 2);
            this.bUV.innerHTML = cF >= 0 ? cF : '<em class="s-fc6">' + cF + "</em>"
        };
    bc.bVh = function () {
            var bqw = 76;
            var bVn = function () {
                if (parseInt(en) > bqw) {
                    bb.ch(this.gi, "height", "auto");
                    bb.ch(this.gi, "height", bqw + "px");
                    bb.ch(this.gi, "overflowY", "scroll")
                } else {
                    bb.ch(this.gi, "height", "auto");
                    bb.ch(this.gi, "height", en);
                    bb.ch(this.gi, "overflowY", "hidden")
                }
            }.bi(this);
            var tG = function (string, number) {
                for (var i = 0, r = ""; i < number; i++) r += string;
                return r
            };
            this.Gl.innerHTML = this.gi.value.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/\n$/, "<br/>&nbsp;").replace(/\n/g, "<br/>").replace(/ {2,}/g, function (space) {
                return tG("&nbsp;", space.length - 1) + " "
            }) + "&nbsp";
            var en = this.Gl.offsetHeight > this.bqr ? this.Gl.offsetHeight : this.bqr;
            en += "px";
            var cdW = bb.ey(this.gi, "height");
            setTimeout(bVn, 10)
        };
    bc.Ja = function () {
            var po = ["overflowX", "overflowY", "fontSize", "fontFamily", "lineHeight"];
            for (var i = 0; i < po.length; i++) {
                bb.ch(this.Gl, po[i], bb.ey(this.gi, po[i]))
            }
            var eZ = this.gi.offsetWidth - parseInt(bb.ey(this.gi, "paddingLeft")) - parseInt(bb.ey(this.gi, "paddingRight")) + "px";
            bb.ch(this.Gl, "width", eZ)
        };
    bc.bUZ = function () {
            if (this.bqK) {
                if (!bb.bP(document.body, "shadow-textarea")[0]) {
                    var eN = '<div style="position:absolute;border: none;left:-10000px;word-wrap: break-word;overflow: hidden;resize:none" class="shadow-textarea"></div>';
                    var bh = bb.oZ(eN);
                    document.body.appendChild(bh);
                    this.Gl = bb.bP(document.body, "shadow-textarea")[0]
                } else {
                    this.Gl = bb.bP(document.body, "shadow-textarea")[0]
                }
                this.bqr = parseInt(bb.ey(this.gi, "height"));
                bb.ch(this.gi, "overflow", "hidden");
                this.Ja()
            }
        };
    bc.zf = function () {
            var be = {};
            this.bK("oncheckvalid", be);
            return !be.stopped
        }
})();
(function () {
    var bd = NEJ.P,
        cg = NEJ.O,
        cC = NEJ.F,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        cA = bd("nej.ui"),
        bI = bd("nej.ut"),
        bm = bd("nej.u"),
        bn = bd("nm.x"),
        bq = bd("nm.d"),
        bT = bd("nm.w"),
        bo = bd("nm.l"),
        bc, bO;
    bT.LW = NEJ.C();
    bc = bT.LW.bU(cA.gh);
    bO = bT.LW.dr;
    bc.dv = function () {
            this.dk = {
                limit: 20,
                parent: null,
                item: {
                    klass: "m-wgt-comment-item",
                    timeformat: bn.sb,
                    getRichText: bn.rP,
                    escape: this.bVB,
                    getAuthIcon: bn.bgj,
                    getPlayCount: bn.nW
                },
                pager: {
                    parent: null,
                    clazz: "u-page"
                },
                cache: {
                    clear: true,
                    lkey: "comment",
                    key: "commentId",
                    data: {},
                    klass: bq.pY,
                    onerror: this.bVE.bi(this)
                },
                onbeforelistload: function (be) {
                    be.value = '<div class="u-load s-fc4"><i class="icn"></i> 加载中...</div>'
                },
                onemptylist: function (be) {
                    be.stopped = !0
                },
                onafterlistrender: this.vn.bi(this)
            };
            this.fT = {
                placeholder: "评论",
                parent: null,
                onsubmit: this.bVF.bi(this),
                oncheckvalid: this.zf.bi(this)
            };
            this.dC()
        };
    bc.dm = function () {
            this.dw()
        };
    bc.cz = function (bf) {
            this.cB(bf);
            this.bS = bq.pY.bF({
                key: "commentId",
                onreply: this.LN.bi(this),
                onerror: this.bVL.bi(this)
            });
            this.zu = bn.bNZ(bf.commentThreadId) || {};
            this.Gf = bf.restrict;
            this.Ge = bT.zv.bF(this.fT);
            var cN = bm.iO(location.search.slice(1));
            if (cN.commentId) {
                this.dk.cache.data.commentId = cN.commentId
            }
            this.dk.item.resUserId = bf.resourceUserId;
            this.dk.cache.data.rid = bf.commentThreadId;
            this.dk.cache.lkey = "comment-" + bf.commentThreadId;
            if (bf.commentCount > 0) {
                this.dk.cache.total = bf.commentCount
            }
            if ( !! this.fl) this.fl.bW();
            this.fl = bI.ju.bF(this.dk);
            this.dq([
                [this.bs, "click", this.fi.bi(this)],
                [bq.pY, "listchange", this.LF.bi(this)]
            ])
        };
    bc.cR = function () {
            this.cV();
            this.Ge.bW();
            if (this.fl) {
                this.fl.bW();
                delete this.fl
            }
        };
    bc.bVB = function (cm) {
            return bm.fd((cm || "").replace(/\s{2,}/g, " ").trim())
        };
    bc.BQ = function () {
            if (GUser && GUser.userId > 0) {
                return !0
            } else {
                top.login();
                return !1
            }
        };
    bc.OQ = NEJ.F;
    bc.LF = function (be) {
            var dL = this.fl.kW();
            if (this.jD) this.jD.innerText = dL;
            switch (be.action) {
            case "reply":
            case "add":
                this.Ge.yJ();
                this.Ge.wO();
                this.bK("onadd", {
                    total: Math.max(dL, 0)
                });
                this.OQ(dL);
                break;
            case "delete":
                this.bK("ondelete", {
                    total: Math.max(dL, 0)
                });
                this.OQ(dL);
                break;
            case "update":
                break
            }
            this.bK("oncountchange", {
                total: Math.max(dL, 0)
            })
        };
    bc.oN = function (bB, bVN) {
            if (!this.BQ()) return;
            if ( !! this.pB) {
                this.pB.input.bW();
                if (this.pB.attachId == bB) {
                    delete this.pB;
                    return
                }
            }
            this.pB = {
                attachId: bB,
                wrapper: bb.ef("div")
            };
            var bl = this.bS.fw(bB);
            bVN.insertAdjacentElement("afterEnd", this.pB.wrapper);
            this.pB.input = bT.zv.bF({
                input: "回复" + bl.user.nickname + ":",
                parent: this.pB.wrapper,
                type: 2,
                onsubmit: this.bVO.bi(this, bB),
                onbeforesubmit: function (be) {
                    var bD = be.value,
                        mb = bD.indexOf(":"),
                        bX = bD.substring(0, mb),
                        cm = bD.substring(mb + 1);
                    if (bX == "回复" + bl.user.nickname) {
                            if (bn.jG(cm)) {
                                bo.ci.bR({
                                    type: "2",
                                    tip: "输入点内容再提交吧"
                                });
                                return false
                            }
                        } else if (bn.jG(bD)) {
                            bo.ci.bR({
                                type: "2",
                                tip: "输入点内容再提交吧"
                            });
                            return false
                        }
                    if (bm.hk(bD) > 2 * 140) {
                            bo.ci.bR({
                                type: "2",
                                tip: "输入不能超过140个字符"
                            });
                            return false
                        }
                    return true
                }
            });
            this.pB.input.mK()
        };
    bc.bVO = function (bB, bD) {
            var bl = this.bS.fw(bB),
                mb = bD.indexOf(":"),
                bX = bD.substring(0, mb),
                cm = bD.substring(mb + 1);
            if (bX == "回复" + bl.user.nickname) {
                    this.bS.baj({
                        key: "comment",
                        data: {
                            commentId: bB,
                            threadId: this.dk.cache.data.rid,
                            content: cm
                        },
                        ext: {
                            index: this.fl.bGY().sp()
                        }
                    })
                } else {
                    this.fl.LK({
                        threadId: this.dk.cache.data.rid,
                        content: bD
                    })
                }
        };
    bc.LN = function (be) {
            this.pB.input.wO();
            this.pB.input.bW();
            bb.dW(this.pB.wrapper);
            delete this.pB
        };
    bc.bba = function (bB) {
            bn.iu({
                btnok: "确定",
                btncc: "取消",
                message: "确定删除评论？",
                action: function (bD) {
                    if (bD == "ok") {
                        this.fl.mw({
                            commentId: bB,
                            threadId: this.dk.cache.data.rid
                        })
                    }
                }.bi(this)
            })
        };
    bc.bVR = function (bB) {
            bn.iu({
                btnok: "确定",
                btncc: "取消",
                message: "确定移除精彩评论？",
                action: function (bD) {
                    if (bD == "ok") {
                        this.fl.mw({
                            type: "hot",
                            commentId: bB,
                            threadId: this.dk.cache.data.rid
                        })
                    }
                }.bi(this)
            })
        };
    bc.fi = function (be) {
            var bh = bj.bY(be, "d:type"),
                bu = bb.bz(bh, "type"),
                bB = bb.bz(bh, "id");
            this.bK("onclick", be);
            if (be.stoped) return;
            switch (bu) {
                case "reply":
                    if (!this.zf({})) return;
                    this.oN(bB, bj.bY(be, "c:itm"));
                    bj.cu(be);
                    break;
                case "delete":
                    this.bba(bB);
                    break;
                case "unlike":
                case "like":
                    if (!this.BQ()) return;
                    if (this.fl) {
                        this.fl.os({
                            commentId: bB,
                            threadId: this.dk.cache.data.rid,
                            like: bu == "like"
                        })
                    }
                    break;
                case "reject":
                    this.bVR(bB);
                    break;
                case "admindelete":
                    bn.iu({
                        btnok: "确定",
                        btncc: "取消",
                        message: "确定删除评论？",
                        action: function (bD) {
                            if (bD == "ok") {
                                this.fl.mw({
                                    type: "admin",
                                    commentId: bB,
                                    threadId: this.dk.cache.data.rid
                                })
                            }
                        }.bi(this)
                    });
                    break
                }
        };
    bc.bVF = function (bD) {
            if (!this.BQ() || bn.jG(bD)) return;
            this.fl.LK({
                threadId: this.dk.cache.data.rid,
                content: bD
            })
        };
    bc.bVE = function () {
            this.Ge.wO()
        };
    bc.bVL = function () {
            if (this.pB) this.pB.input.wO()
        };
    bc.mK = function () {
            bb.nw(this.gX);
            this.Ge.mK()
        };
    bc.vn = function (be) {
            if (be.offset == 0) {
                var kH, eN = "",
                    hJ = '<h3 class="u-hd4">{title}({count})</h3>',
                    OW = this.bS.hT("comment_cur-" + this.dk.cache.data.rid),
                    zB = this.bS.hT("comment_hot-" + this.dk.cache.data.rid);
                if (OW.length || zB.length || this.dk.cache.data.commentId) {
                        if (OW.length) {
                            kH = {
                                beg: 0,
                                end: OW.length - 1,
                                xlist: OW
                            };
                            eN = '<h3 class="u-hd4">当前评论</h3>' + bb.dg(this.dk.item.klass, NEJ.X(kH, this.dk.item)) + "<br>";
                            bb.nw(this.bs)
                        } else if (this.dk.cache.data.commentId) {
                            eN = '<h3 class="u-hd4">当前评论</h3><div class="m-dlist"><div class="src src-empty f-cb"><span class="s-fc4">该评论已删除</span></div></div><br>';
                            bb.nw(this.bs)
                        }
                        if (zB.length) {
                            kH = {
                                beg: 0,
                                end: zB.length - 1,
                                xlist: zB,
                                hot: true
                            };
                            eN = eN + bn.Fn('<h3 class="u-hd4">{title}</h3>', {
                                count: zB.length,
                                title: "精彩评论"
                            }) + bb.dg(this.dk.item.klass, NEJ.X(kH, this.dk.item)) + "<br>"
                        }
                        be.parent.insertAdjacentHTML("afterBegin", eN + "<br>" + bn.Fn(hJ, {
                            count: this.fl.kW(),
                            title: "最新评论"
                        }))
                    } else {
                        be.parent.insertAdjacentHTML("afterBegin", bn.Fn(hJ, {
                            count: this.fl.kW(),
                            title: "最新评论"
                        }))
                    }
            }
            this.bK("onafterlistrender", be)
        };
    bc.zf = function (be) {
            if (this.Gf) {
                if (this.Gf.cp > 0) {
                    return true
                } else {
                    if (this.Gf.fee > 0) {
                        if (this.Gf.st != null && this.Gf.st < 0) {
                            bn.kK(null, null, null, true, {
                                id: this.Gf.songId,
                                privilege: this.Gf
                            })
                        } else {
                            bn.sK(this.Gf.fee, this.Gf.songId, this.Gf.type, null, this.Gf)
                        }
                    } else {
                        if (this.zu && this.zu.type == 18 && this.Gf.toast) {
                            bn.kK(null, null, null, true, {
                                id: this.zu.id,
                                privilege: this.Gf
                            })
                        } else {
                            bn.kK()
                        }
                    }
                    be.stopped = true;
                    return false
                }
            } else {
                return true
            }
        }
})();
(function () {
    var bd = NEJ.P,
        cg = NEJ.O,
        cC = NEJ.F,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        cA = bd("nej.ui"),
        bI = bd("nej.ut"),
        bm = bd("nej.u"),
        bn = bd("nm.x"),
        bq = bd("nm.d"),
        bT = bd("nm.w"),
        bc, bO;
    bT.wv = NEJ.C();
    bc = bT.wv.bU(bT.LW);
    bO = bT.wv.dr;
    bc.dv = function () {
            this.dC()
        };
    bc.dm = function () {
            this.dw();
            var bk = bb.bP(this.bs, "j-flag");
            this.jD = bk[0];
            this.fT.parent = bk[1];
            this.dk.parent = bk[2];
            this.dk.pager.parent = bk[3]
        };
    bc.dx = function () {
            this.dy = "m-wgt-comment"
        };
    bc.cz = function (bf) {
            this.cB(bf);
            this.jD.innerText = bf.commentCount || 0
        }
})();
(function () {
    var bd = NEJ.P,
        fm = window,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        bI = bd("nej.ut"),
        bA = bd("nej.j"),
        bm = bd("nej.u"),
        bo = bd("nm.l"),
        lM = bd("nm.m.c"),
        bq = bd("nm.d"),
        bn = bd("nm.x"),
        bT = bd("nm.w"),
        bQ = bd("nm.m"),
        bL = bd("nm.m.f"),
        bc, bO;
    var SONG_LIST_TPL = {
            2: "m-wgt-song-top50-list",
            19: "m-wgt-album-list"
        };
    lM.bqb = NEJ.C();
    bc = lM.bqb.bU(bQ.ei);
    bc.cY = function () {
            this.df();
            this.rb = bb.bG("content-operation");
            this.jp = bb.bG("comment-box");
            try {
                this.jc = bb.bP(this.rb, "u-btni-fav")[0];
                this.zh = bb.bP(this.rb, "u-btni-share")[0]
            } catch (e) {}
            this.kc = bb.bz(this.rb, "rid");
            this.fL = bb.bz(this.rb, "type");
            var tD = bb.bG("song-list-pre-cache");
            if (tD) {
                this.hw = bT.xn.bF({
                    type: bb.bz(this.rb, "special") == 10 ? "rank" : "",
                    tpl: SONG_LIST_TPL[this.fL],
                    parent: tD,
                    key: bn.bhc(tD),
                    canDel: this.fL == 13 && bb.bz(this.rb, "ishost"),
                    data: {
                        id: this.kc
                    }
                })
            }
            if (this.fL == 13) {
                this.bS = bq.hW.bF({
                    onitemadd: this.vW.gY(this, "success"),
                    onerror: this.vW.gY(this, "error")
                });
                bj.bt(bq.hW, "playcountchange", this.bWg.bi(this));
                bj.bt(bq.hW, "itemchange", this.bWh.bi(this))
            } else if (bb.bG("artist-name")) {
                var uT = bb.bG("artist-name"),
                    Pi = bb.bG("artist-alias"),
                    bWj = bb.bG("artist-home"),
                    FS = uT.parentNode.clientWidth - (bWj ? 150 : 0);
                if (uT.clientWidth > FS) {
                        uT.style.width = FS + "px";
                        bb.bJ(Pi, "f-hide")
                    } else {
                        FS = FS - uT.clientWidth - 15;
                        if (Pi && Pi.clientWidth > FS) {
                            Pi.style.width = FS + "px"
                        }
                    }
                this.Pk = bb.bG("artist-sub");
                this.GJ = bq.sz.bF();
                bj.bt(this.Pk, "click", this.bWk.bi(this));
                bj.bt(bq.sz, "itemchange", this.Nm.bi(this));
                this.fL = this.fL || 2;
                this.kc = this.kc || bb.bz("artist-name", "rid")
            }
            if (this.jp) {
                this.ny = bT.wv.bF({
                    restrict: this.bWm(),
                    parent: this.jp,
                    commentThreadId: bb.bz(this.jp, "tid"),
                    resourceUserId: bb.bz(this.jp, "uid"),
                    commentCount: bb.bz(this.jp, "count"),
                    oncountchange: this.nB.bi(this)
                })
            }
            bT.ciF.bF({
                cat: "detail"
            });
            this.dq([
                [this.rb, "click", this.bWy.bi(this)],
                [document.body, "click", this.cS.bi(this)],
                [bb.bG("album-desc-spread"), "click", this.bWB.bi(this)],
                [fm, "share", this.bby.bi(this)]
            ]);
            this.bWE()
        };
    bc.vW = function (be, bu) {
            if (bu == "success") {
                bb.bz(this.jc, "count", be.ext.subscribedCount);
                this.jc.innerHTML = bn.ue(bn.nW(be.ext.subscribedCount), "已收藏")
            } else {
                bb.bz(this.jc, "count", be.option.ext.subscribedCount);
                this.jc.innerHTML = bn.ue(bn.nW(be.option.ext.subscribedCount), "收藏");
                bb.bH(this.jc, "u-btni-fav-dis")
            }
        };
    bc.bby = function (be) {
            if (this.fL == "18" || !this.fL || be.rtype == 18) return;
            var dE = parseInt(bb.bz(this.zh, "count"));
            bb.bz(this.zh, "count", ++dE);
            this.zh.innerHTML = bn.ue(bn.nW(dE), "分享")
        };
    bc.bWg = function () {
            var dE = parseInt(this.bWH.innerText) || 0;
            this.bWH.innerText = dE + 1
        };
    bc.bWy = function (be) {
            var bh = bj.bY(be, "d:resAction"),
                cl = bb.bz(bh, "resAction"),
                bu = bb.bz(bh, "resType"),
                bB = bb.bz(bh, "resId");
            switch (cl) {
                case "comment":
                    this.ny && this.ny.mK();
                    break;
                case "share":
                case "fav":
                    if (!bn.ic()) return;
                    if (this.bbB(true)) {
                        bj.cu(be)
                    } else if (cl == "fav") {
                        switch (parseInt(bu)) {
                        case 13:
                            if (this.jc.className.indexOf("dis") > 0) break;
                            var dE = parseInt(bb.bz(this.jc, "count"));
                            bb.bJ(this.jc, "u-btni-fav-dis");
                            this.jc.innerHTML = "<i>收藏中...</i>";
                            this.bS.kV({
                                key: "playlist_fav-" + GUser.userId,
                                data: {
                                    id: bB,
                                    subscribedCount: dE
                                }
                            });
                            break;
                        case 2:
                        case 19:
                            var bX = bb.bz(bh, "resName");
                            bn.lP({
                                name: bX,
                                tracks: this.hw.bqY()
                            });
                            break
                        }
                    }
                    break;
                case "download":
                    if (this.bbB(true, {
                        download: true
                    })) {
                        bj.cu(be)
                    }
                    break
                }
        };
    bc.cS = function (be) {
            var bh = bj.bY(be, "d:action");
            switch (bb.bz(bh, "action")) {
            case "rttip":
                bn.kK("由于版权保护，您所在的地区暂时无法使用。");
                break;
            case "outchain":
                var bpB = this.hw && this.hw.bUu();
                if (this.fL == 18) {
                    bpB = bb.bz(this.jc, "fee") > 0 || bb.bz(this.jc, "status") < 0 || this.bbB()
                }
                if (bpB || bb.bz(bh, "rt")) {
                    bn.kK("由于版权保护，无法生成外链。")
                } else {
                    location.dispatch2(bb.bz(bh, "href"))
                }
                break;
            case "tomigu":
                bA.cG("/api/song/migu/url", {
                    type: "json",
                    sync: true,
                    timeout: 3e3,
                    query: {
                        clientType: "web",
                        id: this.kc
                    },
                    onload: function (be) {
                        if (be.code == 200) {
                            window.open(be.webUrl)
                        }
                    }
                });
                break
            }
        };
    bc.nB = function (be) {
            var bh = bb.bG("cnt_comment_count");
            if (bh) {
                if (bh.innerText == "评论") {
                    bh.parentNode.innerHTML = bn.fX('(<span id="cnt_comment_count">{0}</span>)', be.total)
                } else {
                    bh.innerText = be.total
                }
            }
        };
    bc.bWB = function (be) {
            bj.cu(be);
            if (bb.cU("album-desc-dot", "f-hide")) {
                bb.bH("album-desc-dot", "f-hide");
                bb.bG("album-desc-spread").innerHTML = '展开<i class="u-icn u-icn-69"></i>';
                bb.bJ("album-desc-more", "f-hide")
            } else {
                bb.bJ("album-desc-dot", "f-hide");
                bb.bG("album-desc-spread").innerHTML = '收起<i class="u-icn u-icn-70"></i>';
                bb.bH("album-desc-more", "f-hide")
            }
        };
    bc.bWk = function (be) {
            if (typeof GUser !== "undefined" && !GUser.userId) {
                top.login();
                return
            }
            if (!bb.cU(this.Pk, "btnfav-0")) {
                this.GJ.kV({
                    key: "artist_sub",
                    data: {
                        artistId: this.kc
                    }
                })
            } else {
                this.GJ.Mb({
                    key: "artist_sub",
                    data: {
                        artistId: this.kc
                    }
                })
            }
        };
    bc.Nm = function (be) {
            if (this.kc != be.id) return;
            if (be.subscribed) {
                bb.bJ(this.Pk, "btnfav-0")
            } else {
                bb.bH(this.Pk, "btnfav-0")
            }
        };
    bc.bWE = function () {
            var cN = bm.iO(location.search.slice(1)),
                AD = cN.autoplay;
            if (AD) {
                    bn.bFQ("play", parseInt(this.fL), cN.id)
                }
        };
    bc.bWh = function (be) {
            var vp = bb.bG("playlist-track-count");
            if (vp) {
                var dE = parseInt(vp.innerText);
                if (be.cmd == "add") {
                    vp.innerText = dE + 1
                } else if (be.cmd == "del") {
                    vp.innerText = dE - 1
                }
            }
        };
    bc.bbB = function (dS, sm) {
            sm = sm || {};
            if (this.fL != 18) return this.hw ? this.hw.Bp(dS, sm) : false;
            var wR = {
                fee: parseInt(bb.bz(this.jc, "fee")),
                payed: parseInt(bb.bz(this.jc, "payed")),
                pl: parseInt(bb.bz(this.jc, "pl")),
                dl: parseInt(bb.bz(this.jc, "dl")),
                toast: bb.bz(this.jc, "toast") == "true",
                st: parseInt(bb.bz(this.jc, "st"))
            };
            var bpz = {
                id: bb.bz(this.jc, "resId"),
                privilege: wR
            };
            var gr = bn.oP(bpz);
            if (gr == 0) return false;
            if (gr == 10) {
                if (dS) bn.sK(wR.fee, bpz.id, "song", null, wR);
                return true
            }
            if (gr == 100) {
                if (dS) {
                    bn.kK(null, null, null, true, bpz)
                }
                return true
            }
            if (gr == 1e3 && sm.download) {
                if (dS) bn.kK("因版权方要求，该歌曲不支持下载");
                return true
            }
            return false
        };
    bc.bWm = function () {
            if (this.fL == 18) {
                return {
                    songId: bb.bz(this.jc, "resId"),
                    fee: parseInt(bb.bz(this.jc, "fee")),
                    cp: parseInt(bb.bz(this.jc, "cp")),
                    pl: parseInt(bb.bz(this.jc, "pl")),
                    dl: parseInt(bb.bz(this.jc, "dl")),
                    toast: bb.bz(this.jc, "toast") == "true",
                    st: parseInt(bb.bz(this.jc, "st"))
                }
            } else {
                return this.hw && this.hw.baa()
            }
        };
    bb.dV("template-box");
    new lM.bqb
})();
(function () {
    var bd = NEJ.P,
        cg = NEJ.O,
        bb = bd("nej.e"),
        bj = bd("nej.v"),
        bm = bd("nej.u"),
        bI = bd("nej.ut"),
        bA = bd("nej.j"),
        eT = bd("nm.ut"),
        bQ = bd("nm.m"),
        bq = bd("nm.d"),
        bn = bd("nm.x"),
        bL = bd("nm.s"),
        bo = bd("nm.l"),
        bc, bO;
    bL.bnA = NEJ.C();
    bc = bL.bnA.bU(bI.fb);
    bc.cY = function () {
            this.df();
            var bZ = "/api/song/lyric",
                cN = {
                    id: bb.bz("lyric-content", "songId"),
                    lv: -1,
                    tv: -1
                };
            this.EF = cN.id;
            bA.cG(bZ, {
                    sync: false,
                    type: "json",
                    query: cN,
                    method: "get",
                    onload: this.bny.bi(this),
                    onerror: this.bny.bi(this)
                });
            bn.bnT();
            bj.bt(document.body, "click", this.cS.bi(this))
        };
    bc.cac = function () {
            var bew = bb.bG("flag_more");
            if (bb.cU(bew, "f-hide")) {
                bb.bH(bew, "f-hide");
                bb.bG("flag_ctrl").innerHTML = '收起<i class="u-icn u-icn-70"></i>'
            } else {
                bb.bJ(bew, "f-hide");
                bb.bG("flag_ctrl").innerHTML = '展开<i class="u-icn u-icn-69"></i>'
            }
        };
    bc.cS = function (be) {
            var bh = bj.bY(be, "action");
            switch (bb.bz(bh, "action")) {
            case "loginlink":
                if (!bn.ic()) return;
                location.dispatch2(bb.bz(bh, "href"))
            }
        };
    bc.bny = function (be) {
            var sD = be.lrc || {},
                Rm = be.tlyric || {},
                bh = bb.bG("lyric-content");
            this.mR = eT.boe(sD.lyric, Rm.lyric);
            bb.fR(bh, "m-lyric-content", {
                    id: this.EF,
                    nolyric: be.nolyric,
                    limit: Rm.lyric ? 6 : 13,
                    lines: this.mR.lines,
                    thirdCopy: bb.bz(bh, "thirdCopy") == "true",
                    copyFrom: bb.bz(bh, "copyFrom")
                });
            be.scrollable = this.mR.scrollable;
            be.songId = this.EF;
            bb.fR("user-operation", "m-user-operation", be);
            bj.bt("flag_ctrl", "click", this.cac.bi(this))
        };
    new bL.bnA
})()