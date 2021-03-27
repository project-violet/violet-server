
## Query for View Time

```sql
# Average, Variance whatching seconds per pages
select avg(a.ViewSeconds/b.Pages), variance(a.ViewSeconds/b.Pages) from viewtime 
as a left join article_pages as b on a.ArticleId=b.Id where b.Pages<>0;
+----------------------------+---------------------------------+
| avg(a.ViewSeconds/b.Pages) | variance(a.ViewSeconds/b.Pages) |
+----------------------------+---------------------------------+
|                 6.21027920 |                  26519.15946969 |
+----------------------------+---------------------------------+
std: 162.847043171
  p: x<=302.50143 = 0.9808


# Max seconds per pages item
select *, a.ViewSeconds/b.Pages FROM 
viewtime as a left join article_pages as b on a.ArticleId=b.Id
WHERE (ceil(a.ViewSeconds/b.Pages)) IN
(select ceil(max(a.ViewSeconds/b.Pages)) from viewtime as a left join article_pages as b on a.ArticleId=b.id);
+--------+-----------+---------------------+-------------+------------------------------------------+---------+-------+-----------------------+
| Id     | ArticleId | TimeStamp           | ViewSeconds | UserAppId                                | Id      | Pages | a.ViewSeconds/b.Pages |
+--------+-----------+---------------------+-------------+------------------------------------------+---------+-------+-----------------------+
| 142408 |   1746781 | 2021-03-18 22:51:33 |      163895 | dc6122d9b5cb83d27df3617a031d3c84250b5d80 | 1746781 |     3 |            54631.6667 |
+--------+-----------+---------------------+-------------+------------------------------------------+---------+-------+-----------------------+

# List seconds per pages item
select *, a.ViewSeconds/b.Pages FROM 
viewtime as a left join article_pages as b on a.ArticleId=b.Id
order by a.ViewSeconds/b.Pages desc limit 100;
+--------+-----------+---------------------+-------------+------------------------------------------+---------+-------+-----------------------+
| Id     | ArticleId | TimeStamp           | ViewSeconds | UserAppId                                | Id      | Pages | a.ViewSeconds/b.Pages |
+--------+-----------+---------------------+-------------+------------------------------------------+---------+-------+-----------------------+
| 142408 |   1746781 | 2021-03-18 22:51:33 |      163895 | dc6122d9b5cb83d27df3617a031d3c84250b5d80 | 1746781 |     3 |            54631.6667 |
|  64578 |   1859413 | 2021-03-09 07:50:54 |      424640 | 5805d2e4d026abeab2c6580c535e7d65eb951529 | 1859413 |    16 |            26540.0000 |
|  67256 |   1393865 | 2021-03-09 15:31:23 |       82199 | 05ef7056ec83b28ff40f7984012833860a92a2ce | 1393865 |     5 |            16439.8000 |
| 143744 |   1867473 | 2021-03-19 04:09:37 |      357069 | 6286e022b4c961025fc5078d4d894707c6075ab4 | 1867473 |    32 |            11158.4063 |
| 199039 |   1174105 | 2021-03-25 23:25:03 |      279418 | 57d6f650bf3d20961c5b2299c84b49949264ea51 | 1174105 |    30 |             9313.9333 |
|  72915 |   1705086 | 2021-03-10 09:36:54 |       95277 | 9df0e436be76ef5c0655075550e2e149d41b6170 | 1705086 |    12 |             7939.7500 |
| 186582 |   1872677 | 2021-03-24 09:06:28 |      144145 | dabb7fb9133717883891bd50962d035548c34234 | 1872677 |    20 |             7207.2500 |
...
```