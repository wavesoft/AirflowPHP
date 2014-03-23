{extends file="skel/basic.tpl"}
{block name="template_body"}
		{foreach $nodes as $n}
		{$n->render()}
		{/foreach}
{/block}
