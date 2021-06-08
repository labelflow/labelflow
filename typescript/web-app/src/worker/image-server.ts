import { isString, trimCharsEnd } from "lodash/fp";
import { db } from "../connectors/database";

declare let self: ServiceWorkerGlobalScope;

export const server = {
  installListener: (path = "/worker/images") => {
    const trimedPath = trimCharsEnd("/", path);
    const regex = new RegExp(`${trimedPath}/(?<fileId>.*)`);

    self.addEventListener("fetch", (event: any) => {
      const { request } = event;

      if (request.method === "GET") {
        const url = new URL(request.url);
        const found = url.pathname.match(regex);
        if (!isString(found?.groups?.fileId)) {
          return;
        }
        const fileId = found?.groups?.fileId as string;
        const buildResponse = async () => {
          const file = await db.file.get(fileId);
          if (!file || !("blob" in file)) {
            throw new Error(`No file found for id ${fileId}`);
          }
          // To return the labelflow logo image to test:
          //
          // const labelFlowPngLogoBase64Content =
          //   "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABaqSURBVHgB7d1RdhTXtQbgXd3i+ZIRpD2CyO8Gq+IBWIwANALDCIxHAIzAYgTI784tGfweZQRRRnB1Xy/dXbeO1LIBIyOhrqpTVd+3VmxIllektYzOX/v8tTsCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAclEEwFWq6m7z192dnfX+OmZfRx13iyIWm//1rI44bX5/0vz6ePU2fomyPA1gEAQA4I+ag3+2E981PyAeN7+7e4N/8qj5qXK0+qp8GUDWBADgPbM3VTr4n8bNDv4PnZ0HgbfxspkKHAeQHQEAuFBVi/lO/Nj8ai+267T5SZOuCF40YeAkgCwIAEDMX/+8H8U8Hf63eeq/jtM64vl6GT/pC0C/BACYsnTXP4/vi+L8rr9rx81PoEPlQeiHAABTVVW7zcj/VfOrRfRPeRA6JgDABG2Kfs8jP5d9AeVBaJkAAFPSXtGvDcqD0CIBACZi/mv1MOrzp/62i35bV0ecFEU81xeA7REAYOwuin7PmgP0UYyD8iBsgQAAY1ZVe5uR/yLG6Wi1PO8LHAVwIwIAjNTsdfWsp9f7+qA8CDckAMDYVNVi5068quvYjWk6LWL903I5e+6KAK4mAMCIbGmP/2goD8LVBAAYg6q6u7nr3w+uclkeTGuIzwImTgCAoRt/0W/7fg8CyoNMlgAAQ9XvHv+xUB5ksgQAGKK89viPhfIgkyIAwMAo+rVPeZApEABgKIa1x39MlAcZJQEABmD++uf9KObp8PfU3yflQUZEAICcKfrlSnmQwRMAIFde7xsK5UEGSQCADG2Kfs+DQVEeZEgEAMiJot+YKA+SNQEAMuH1vhFTHiRDAgD0zR7/KVEeJBsCAPRJ0W/KlAfplQAAPZm9rp55vY9EeZA+CADQtapa7NyJV3UduwF/pDxIJwQA6JCiHzeiPEiLBADogtf7uB3lQbZOAIC2XRT90kf3eupnG07riMP18jwMnAZ8JgEA2mKPP+277AsoD3JjAgC0oap2N0/9i4BuKA9yIwIAbJk9/vTsrPnJfqQvwKcIALAtin7kR3mQKwkAsAXzX6uHUZ8/9Sv6kSvlQd4jAMBtKPoxTMqDCADw2ezxZxyOzjsDX5Uvg0kRAOAz2OPPCCkPTowAADdhjz/TcFkefNGEgZNglAQAuCZ7/JmoVB58vl6e7xc4DUZDAIBPqaq7m7v+/YBpUx4cEQEA/oyiH1xFeXDgBAD4GK/3wXUpDw6UAAAfqqrdnTvxo6If3JhlQwMiAMA7FP1gK07r9frF+utvfCZGxgQASOzxhzYcr5ZxYBqQJwGAyZu//nk/ink6/D31w/adNiGgFALyIwAwXYp+0BUhIEOzgCmqqt1m5P9Phz904vKKjYwIAExOKvqlwz+82w9d2pv98g+BOyOuAJgORT/o21lzFfBFcxVwFvTOBIBJeOepfy+AvtydzdamAJkwAWDcLop+6aN7HwWQA1OATJgAMF4Xe/z/6fCHrNzd2bFlMwcCAKM0e109aw7/KhT9IDvr9dona2ZgJ2BMqmqxcyde2eMPGZvNvg56ZwLAaFwW/Rz+kLfC1s0smAAwfFV1tzn4X4WGPwzFIuidCQDDtin6hcMf4EZMABgme/wBbkUAYHgu9vinkf8iAPgsrgAYFHv8AbbDBIBhsMcfYKsEALI3f/3zfhTnh79XhwC2RAAgX5uiXyj6AWydAECeLl7vS0/9iwBg65QAyY49/gDtMwEgH4p+AJ0xASAL77zetxcAtM4EgH5d7PFPT/0+HhSgQyYA9Of3Pf4Of4COmQDQPXv8AXonANCtqlrs3IlXdR27AUzVadA7VwB05rLo5/AH6J8JAO3zeh9AdgQAWmWPP0CeBADaYY8/I9RcX501/06fFtH8/d3/PgXcOhZFIegyHAIA21dVu83I/1VY5cuApcO+OdBP6pgdzWL9r+UyTqIsz/70H2qC785O7K5j9rci1un11r2ATBUBW5SKfs2/VM8Dhuu4eZp/uVrF0ScP/E9Ji67mka7BHoYw8K7T1b3yi6BXAgDboejH0BVxuHobPzSH/mm0If0ZmddPoygeBgJABgQAbm3+a/WweWJKT/3uPxmi49UyDlo7+D8kCCQCQAYEAD7fRdHvWXNP+ihgYNId/6yIB8t75XH0YP66elTH+UbMRUyPAJABi4D4PJs9/g5/Bup4vYov+jr8k9X98rD5Gsrml0cBPTAB4MZmr6tn9vgzVM0PvRfNwZ/Vv787b6qnaRoQ02ECkAGvAXJ99vgzcM3h/0Nz+D+NzKSvqQkBMbEQQM9cAXAt9vgzdLke/pfS15a+xoCOmADw59J7zBdLffYCBir3w/+SSQBdMgHgapuiXzj8GbajIRz+lzZfq2IgrTMB4I82e/wV/Ri65srqdL2KJzEwaS9B82dwd6KvCNIREwDed7HH/58Of8ZgVnS44GebyvLs/GuHFgkA/Oay6Bc+xIcxKOKwz/f8byt97UWsXwS0xBUA9vgzOuej/+XwG/XL5exp82czrQy2ZputMwGYuPnrn/cV/RibZnz+cpCj/w81VwH12hSAdggAU5WKfq+rZ1HM0yt+ni4Yk7PlMg5jJNbrWfqgrdt9LDF8hAAwRb/v8Vf0Y3yKOBrF0/+liynAy4AtEwAmZvam+r45/KtQ9GOkVm9jdCPz2WxmLwBb58OApkLRjwk4L//dH+eHzMxfV/+O8ewF8GFAGTABmIB3Xu/bCxizev1TjFQ94u+NfngNcMwu9vinp/79gAlIo/J1jFP63uqI7wK2xARgrH7f4+/wZzKWyziJkRrz90Y/BIARSq/3KfoxNc3T8UlqzMdYpe+tjtMYh9Ogd64AxqSqFjt34lVdx27AxBRTeFe+OJ8CLAK2wARgJC6Lfg5/pqper/8VI9d8j/8J2BITgKHzeh9cmsK2PBsB2RoBYMguin5W+cKF0R+OReHunO0RAIYo7fGfx/dW+cLvmj8Pno7hBgSAoamq3c1T/yKA39T1+Cdh6Xss7G9lS5QAB+SdjX6LAD40hasw131sjQnAECj6wXUIAHADJgCZm/9aPbTHHz6tKIpFjFwxm/01YEtMAHK1KfpFregH11IUf4uRK4pY1HXAVpgA5Gizx1/LH25kkYJzjFXzvVn0xTYJAJmxxx8+387OqA9Ihz9b5QogF/b4w62t1+v06ZfHMUKzWfrePLOxPf5tyoA9/rAdxWz2bYzUmL83+iEA9Km505u/qV4VEc/D6z2wDYudN9VejE1VpYeDRcAWCQB92RT9ml/tB7A1m2uAUZnPa4Vgtk4A6Fp6vU/RD1rTjMofjuptgKpaRFEY/7N1AkCXLop+ldf7oFV3Z7P1aP6MzXbiYbgipAUCQFcu1vlWin7QvmYK8N0opgDNz40i4lFACwSALmwO/zDyh67cbaZt38fANXf/T8PPDVoiAHTA4Q/da6Ztjwf9RkDVfO1F8TCgJQJAy2ZvqvQUsgigc3XEj4O8Cvj9E0ChNQJAmy7u754G0Jd0kL6KgWm+5mfhwYGWCQAt2tzfAf3a20ziBmHztdoPQusEgLaksaP7O8hCmsQNIQSkr9HUkK4IAC2Zz8e3jQyGLPcQ4PCnawJAa4q9ALKSawhI20Ed/nTNxwG3pSj+GkB20kE7f1PtrZZxEGV5Gn36ve2/F9AxE4D22PgH+UofxlXNf6166+nMX/+8v/lAsL2YmiJOg96ZALTH7m7I2yLqOGxCwN7qbfzQ2TTAUz+ZMAEApq2OR82B/O8mCPx4/sl7bamq3fnr/z5M/1/h8CcDJgDtOQtTABiOiyDwKN5Ux82I+rCZCvzUTAXO4jYuthCmUX+6atg7byBAJgSAlhTNHZdP/oNB2mvCQOoIRAoD9Xr9y3o9O25+d/LJQHBx4O/OduJvxcUyn/QzwIMAWRIAWrJe1f8qZoUAAMO2V8xme/PZ5pMF31RndcRpcTHh+00T9hdN6E8HvcOewRAAWlIU9XHzV5sAYVzuFh95w6cw2WeAlABbslrNjuKDpwQAyIUA0JaLu8LjAIAMCQAtaqaCLwIAMiQAtGh5rzwuYi0EAJAdAaBly+XsaV1bewlAXgSAtpXl2XwWD0IhEICMCAAdePtVeTIrogwhAIBMCAAduQwBrgMAyIEA0KEUAtarZhJQ1y8DAHokAHStLE9X9//+qIjzK4HjAIAeCAA9Sa8Iru6V5WoZX6RXBV0NANAlG6wzsvOm2qvr+lEdxddFEYsAGKP0cctflQdBr3wYUEbSVCA21wLz19V+RL0fhQ8UAmD7XAFkanW/PEpdgeaK4C9RR0rKxwEAW+IKYEiqajGfx15dxHcf+0hSgEFwBZAFAWCg7vxa7a7X9WN9AWBwBIAs6AAMVNop0PztUfq18iAANyUAjMAfyoNFpOLgfgDAFZQAR+a8PHivfJD2CygPAnAVHYApUB4EcqIDkAUBYGKUB4G+1ev1i/XX3zwOeqUDMDFXlAe/bcLA3QDoho9Gz4AAMGEflAcfNfOgb0N5EGASlAA5t7pfHioPAkyHCQDvSx9XHHEY6T9VtZjtzL5tLuwe6wsAjIsJAFdrwsD63tcv1vfLL2ZFfBl1/dLHFgOMgwkA16I8CDAuAgA3pjwIMHyuALgV5UGAYTIBYDuUBwEGxQSA7VMeBMieCQCtUh4EyJMAQGeUBwHy4QqAXigPAvTLBIB+KQ8C9MIEgHwoDwJ0xgSALCkPArTLBIDspfLg6v7fH61X+gIA22ICwHCU5dm7fYH5PPaiiIfN7/cCgBsRABimD8qDOzvxaF3HQ+VBgOtxBcDwNWGguSZ4msqDRfM75UGATzMBYFQ+WDa0H1HvR1E8DADeYwLAaK3ul0epPLhaxl+UBwHeZwLA+H2kPFgX8V1zXbAbABNlAsC0pPLg/fJwfa/8Mq0hLmL9Ql8AmCIBgOk6Lw9+81h5EJgiVwAQyoPA9JgAwAeUB4EpMAGAqygPAiNWBHAz55sH14/X9exbmwfhM9Trg9X9bw6DXgkAcAvvfFLh18IAXJMAkAVXAHALyoPAUCkBwpa8Wx6s1/EkADImAMC2leXZeh1HAZAxAQAAJkgAAIAJEgAAYIIEAACYIAEAACZIAACACRIAoB13AyBjAgC0QwCAq8zv/E/QOwEAgE6t/m/1n6B3AgAA3SrLk6B3AgAAXToOsiAAANCdYnYYZMHHAQPQibqO0/Vy/UuQBRMAADoxK+JllOVpkAUTAABal57+V6t4HmTDBACA1jVP/wfN0/9ZkA0BAIBWFRE/LO+Vx0FWBAAAWrM5/J8G2REAANi65s7/rBn7P3H450sJEICtqiNO1qt4sL6v8Z8zAQCArWlG/i9W98rHQfYEAABuLb3ml5r+yn7DoQMAwG0dNSP/Lx3+w2ICAMBnSUW/+Sx+ePtVacHPAAkAAHyO4+ap/0DRb7gEAABuJL3e56l/+AQAAK7lsujXHP7HweApAQLwSen1PkW/cTEBAOBKqejXHP4Hy/vlUTAqJgAAXCUV/b5cOfxHyQQAgPd4vW8aBAAAfpOKfps9/ifBqLkCAODcZdEvSof/FJgAAEycPf7TZAIAMG32+E+UCQC0YD5fL+RrcqbohwAAMDF1xMmm6HcaTJYAADAhqei3ulc+DiZPAACYAEU/PuSSEmDs6nip6MeHTAAARmpT9Hvy9l55GPABAQBgnNIe/wNFP64iAACMTHPX/8TrfXyKAAAwEpd7/FdW+XINSoAAI2CPPzdlAgAwYKno1xz+B8v75VHADZgAAAxXKvp9uXL48xlMAAAGxh5/tkEAABgQe/zZFlcAAANxXvRbRhmlw5/bMwEAyJw9/rTBBAAgb0f2+NMGEwCADCn60TYBACA/9vjTOgEAICOp6NeM+x8HtEwAAMiAoh9dUwIE6NnlHn+HP10yAQDoiT3+9MkEAKAf9vjTKxMAgI41d/1PvN5H3wQAgI6kol/a478qy5OAnrkCAOjAZdEvHP5kwgQAoEVe7yNXAgC0oPmhvyiKgOPzj+4ty7OAzAgAAFtmjz9DIAAAbFEdcXL+1G+PP5kTAAC2JBX9Vvb4MxACAMAtKfoxRF4DBLiNOl7a488QmQAAfIbfin73FP0YJgEA4ObS630Hin4MmQAAcAP2+DMWAgDANdjjz9goAQJ8gj3+jJEJAMAVUtGvOfwPlvfLo4CRMQEA+LhU9Pty5fBnpEwAAN5hjz9TIQAAbGz2+KfX+9z1M3quAABiU/RbRqnox1SYAACTZo8/U2UCAEzZkT3+TJUJADA5in4gAADTY48/hAAATEgq+jXj/scBCADA+Cn6wR8pAQKjdrnH3+EP7zMBAEZpU/RLH917GMAfCADAGCn6wScIAMCoNHf9T7zeB58mAACjkIp+zVP/g5VVvnAtSoDA4F0W/ezxh+szAYB23A1al4p+zcj/gYY/3JwJALSiEADal4p+Xzj84fOYAACDYo8/bIcAAAxGHXGSin5e74PbEwCAQUhFv5U9/rA1AgCQNXv8oR1KgEDOjuzxh3aYAADZUfSD9gkAQG7s8YcOCABANuzxh+4IAEDvLot+zeF/HEAnlACBXl3u8Vf0g26ZAAC9SEW/5vA/WN4vjwLonAkA0IdU9Pty5fCH3pgAAJ3xeh/kQwAAOpGKfps9/icB9M4VANC6y6JflA5/yIUJANAae/whXyYAQFvs8YeMmQAAW6XoB8MgAABbU0ecbIp+pwFkTQAAtiIV/Vb3yscBDIIAANyKoh8MkxIg8Nns8YfhMgEAbmxT9Esf3XsYwCAJAMBNpT3+B4p+MGwCAHBtzV3/E6/3wTgIAMAnXe7xX1nlC6OhBAgtKGbFf8VI2OMP42QCAO24GwOXin7NyP+Bhj+MkwkA8DHHXu+DcTMBAH5jjz9MhwAAnLPHH6ZFAADs8YcJEgCgHWcxAPb4w3QpAUIL6nX9v5G/I0U/mC4TAGhFfXo+WM+Qoh+QCADQgqKoc12aY48/cE4AgBasVvPjeWZ/upp5xA/NuP9pAIQOALSjLFMJ8DgykIp+zeFfOvyBdwkA0JL0xB09u9zjr+gHfCjPlhKMxPxNVTV/24uOpaJf84f7YHW/PAqAjzABgBb1NAU43+Pv8Af+jAkAtGznzT+e1zH7LjowK+KJ1/uA6xAAoANtXwWkol/a4x9lmevrh0BmXAFAB1bLeJA+bCdacFn0c/gDN2ECAB3a5nWAPf7AbZgAQIeW9755HHUcpMM7bscef+BWTACgD1W1uHMn9lfr+K4oYnGDf/J4s9HvOABuQQCAnu28qfYi1vvN1cDfmsnA4jIQpHf5m7+dFbM4ruvZyXq5frnZMAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB06/8B92d0xVDfxgcAAAAASUVORK5CYII=";
          // const blob = new Blob(
          //   [
          //     Uint8Array.from(self.atob(labelFlowPngLogoBase64Content), (c) =>
          //       c.charCodeAt(0)
          //     ),
          //   ],
          //   { type: "image/png" }
          // );
          const { blob } = file;
          const response = new Response(blob, {
            status: 200,
            statusText: "OK",
            headers: new Headers(),
          });
          return response;
        };
        event.respondWith(buildResponse());
      }

      if (request.method === "PUT") {
        const url = new URL(request.url);
        const found = url.pathname.match(regex);
        if (!isString(found?.groups?.fileId)) {
          return;
        }
        const fileId = found?.groups?.fileId as string;
        const buildResponse = async () => {
          const blob = await request.blob();
          await db.file.add({ id: fileId, blob });
          const response = new Response("", {
            status: 200,
            statusText: "OK",
            headers: new Headers(),
          });
          return response;
        };
        event.respondWith(buildResponse());
      }
    });
  },
};
