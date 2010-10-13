<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <title>Registry database reports</title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><cl:homeLink/></span>
            <span class="menuButton"><g:link class="list" action="list">Reports</g:link></span>
        </div>
        <div class="body">
            <h1>Recent changes</h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
              <p>Click a row to show full details of a change.</p>
              <table>
                <colgroup><col width="23%"/><col width="25%"/><col width="12%"/><col width="40%"/></colgroup>
                <tr class="reportHeaderRow"><td>When</td><td>Who</td><td>Did</td><td>What</td></tr>
                <g:each var='ch' in="${changes}">
                  <tr>
                    <td><g:link controller="auditLogEvent" action="show" id="${ch.id}">${ch.lastUpdated}</g:link></td>
                    <td><g:link controller="auditLogEvent" action="show" id="${ch.id}"><cl:boldNameInEmail name="${ch.actor}"/></g:link></td>
                    <td><g:link controller="auditLogEvent" action="show" id="${ch.id}"><cl:changeEventName event="${ch.eventName}"/></g:link></td>
                    <td><g:link controller="auditLogEvent" action="show" id="${ch.id}">
                      <g:if test="${ch.eventName == 'UPDATE'}"><b>${ch.propertyName}</b> in</g:if>
                      <cl:shortClassName className="${ch.className}"/><b>
                      <g:if test="${ch.uri}">${ch.uri}</g:if>
                      <g:else>${ch.persistedObjectId}</g:else>
                      </b>
                    </g:link></td>
                  </tr>
                </g:each>
              </table>
            </div>
        </div>
    </body>
</html>