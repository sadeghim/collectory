<%@ page import="au.org.ala.collectory.CollectoryTagLib" %>
<div class="section">
    <g:set var="facet" value="${new CollectoryTagLib().getFacetForEntity(instance)}"/>
    <h3>Data access</h3>
    <div class="dataAccess btn-group-vertical">
        <h4><a id="totalRecordCountLink" href="${grailsApplication.config.biocacheUiURL}/occurrences/search?q=${facet}:${instance.uid}"></a></h4>

        <a href="${grailsApplication.config.biocacheUiURL}/occurrences/search?q=${facet}:${instance.uid}" class="btn"><i class="icon icon-list"></i> View records</a>
        %{--<a href="${grailsApplication.config.biocacheServicesUrl}/occurrences/download?q=${facet}:${instance.uid}" class="btn"><i class="icon icon-download"></i> Download records</a>--}%

        <g:if test="${!grailsApplication.config.disableLoggerLinks.toBoolean() && grailsApplication.config.loggerURL}">
            <a href="${grailsApplication.config.loggerURL}/reasonBreakdownCSV?eventId=1002&entityUid=${instance.uid}" class="btn"><i class="icon icon-download-alt"></i> Download usage stats</a>
        </g:if>

        <cl:createNewRecordsAlertsLink query="${facet}:${instance.uid}" displayName="${instance.name}"
            linkText="Alert me about new records" altText="Create an email alert for new records for ${instance.name}"/>

        <cl:createNewAnnotationsAlertsLink query="${facet}:${instance.uid}" displayName="${instance.name}"
            linkText="Alert me about annotations" altText="Create an email alert for new annotations for ${instance.name}"/>
    </div>
</div>