
# ================================================================ info ===== #

# ======================================================= configuration ===== #

# ------------------------------------------------------------- targets ----- #

# defaults
MENU := all clean test

# helpers
MENU += help readme

# main
MENU += run show-dist upgrade

# load phony
.PHONY: $(MENU)

# ------------------------------------------------------------ settings ----- #

# set default target
.DEFAULT_GOAL := help

# sets all lines in the recipe to be passed in a single shell invocation
.ONESHELL:

# ----------------------------------------------- environment variables ----- #

# load current shell env vars into makefile shell env
export

# ----------------------------------------------------------- functions ----- #

# note that define can only take single line or rule

define func_print_arrow
	# ==> $(1)
endef

define func_print_header
	# =================================================== $(1) ===== #
endef

define func_check_file_regex
	cat $(1) || grep "$(2)"
endef

define func_check_command
	command -V $(1) || printf "$(2)"
endef

define func_print_tab
	printf "%s\t\t%s\t\t%s\n" $(1) $(2) $(3)
endef

# ================================================================ main ===== #

##@ Helpers

help:														## display this help
	@awk 'BEGIN { FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"; } \
		/^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2; } \
		/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5); } \
		END { printf ""; }' $(MAKEFILE_LIST)

readme:													## show information and notes
	$(call func_print_header,"show readme")
	@touch README.md
	@cat README.md

##@ Menu

# core commands

run: 														## run project
	$(call func_print_header,"run")
	node lunar.js

show-dist: 											## open dist folder on mac
	$(call func_print_header,"build")
	open .

test: 													## test project
	$(call func_print_arrow,"run tests")
	# bats -r test/*
	shellcheck Makefile
